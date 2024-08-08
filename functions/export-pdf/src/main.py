from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.users import Users
from appwrite.permission import Permission
from appwrite.role import Role
import os
import html

import json
import textwrap
from itertools import zip_longest

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Preformatted, KeepTogether, Table, \
    TableStyle
from reportlab.lib.units import inch
from reportlab.lib.utils import ImageReader
from io import BytesIO
import requests


def fetch_image(url,document, max_height=6 * inch):
    response = requests.get(url)
    if response.status_code == 200:
        img_data = BytesIO(response.content)
        img = ImageReader(img_data)
        img_width, img_height = img.getSize()

        # Calculate the scaling factors for width and height
        max_width = (document.width - document.leftMargin - document.rightMargin)
        width_scale = max_width / img_width
        height_scale = max_height / img_height

        # Choose the smaller scaling factor to maintain aspect ratio
        scale = min(width_scale, height_scale)

        # Calculate the new dimensions
        new_width = img_width * scale
        new_height = img_height * scale

        return Image(img_data, width=new_width, height=new_height)
    return None
def parse_kanban_block(kb_data,document,styles):
    kb_title = kb_data.get('title', '')
    backlog = kb_data.get('backlog', [])
    doing = kb_data.get('doing', [])
    done = kb_data.get('done', [])

    elements = []

    # Add title
    elements.append(Paragraph('Kanban: <b>' +(html.escape(kb_title)) + '</b>', styles['Heading3']))
    elements.append(Spacer(1, 0.2 * inch))

    # Transpose the data to arrange it properly for the table
    transposed_data = list(zip_longest(backlog, doing, done, fillvalue=''))

    # Create the table data with titles
    table_data = [["Backlog"] + ["Doing"] + ["Done"]] + transposed_data

    # Calculate available width with margin
    available_width = (document.width - document.leftMargin - document.rightMargin)

    # Calculate column widths for equal width
    num_cols = len(table_data[0])
    col_width = available_width / num_cols

    wrapped_table_data = []
    for row in table_data:
        wrapped_row = []
        for cell in row:
            if cell:  # Check if cell is not empty
                wrapped_text = '\n'.join(textwrap.wrap(cell, width=20))
                wrapped_row.append(html.escape(wrapped_text))
            else:
                wrapped_row.append('')
        wrapped_table_data.append(wrapped_row)


    # Create the table
    table = Table(wrapped_table_data, colWidths=[col_width]*num_cols, repeatRows=1)

    # Set table style
    style = TableStyle([('BACKGROUND', (0, 0), (-1, 0), '#D3D3D3'),
                        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
                        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                        ('GRID', (0, 0), (-1, -1), 1, colors.black),
                        ('WORDWRAP', (0, 0), (-1, -1), 1)])  # Enable word wrap
    table.setStyle(style)

    # Add table to elements
    elements.append(table)

    return elements

def generate_pdf(json_data,pdf_file):
    code_style = ParagraphStyle(
        'Code',
        fontName='Courier',
        fontSize=10,
        leading=12,
        spaceBefore=6,
        spaceAfter=6
    )
    
    title = json_data['title']
    data = json.loads(json_data['content'])

    document = SimpleDocTemplate(pdf_file, pagesize=letter)
    document.title = title
    
    styles = getSampleStyleSheet()
    story = [Paragraph('<b>' + html.escape(title) + '</b>', styles['Title']), Spacer(1, 0.5 * inch)]

    for item in data:
        elements = []  # Collect elements for this section
        if item['type'] == 'h1':
            elements.append(Paragraph(html.escape(item['text']), styles['Title']))
        elif item['type'] == 'h2':
            elements.append(Paragraph(html.escape(item['text']), styles['Heading2']))
        elif item['type'] == 'h3':
            elements.append(Paragraph(html.escape(item['text']), styles['Heading3']))
        elif item['type'] == 'p':
            elements.append(Paragraph(html.escape(item['text']).replace("\n", "<br />"), styles['BodyText']))
        elif item['type'] == 'cd':
            elements.append(Preformatted(html.escape(item['text']), code_style))
        elif item['type'] == 'img' and 'url' in item:
            img = fetch_image(item['url'],document)
            if img:
                elements.append(img)
        elif item['type'] == 'kb':
            kb_elements = parse_kanban_block(item,document,styles)
            elements.extend(kb_elements)
        elif item['type'] == 'sep':
            elements.append(Spacer(1, 0.2 * inch))

        if elements:
            # Ensure elements are kept together on the same page
            story.append(KeepTogether(elements))
            story.append(Spacer(1, 0.2 * inch))

    document.build(story)


def validate_session(users,user_id,session_id):
    try:
        result = users.list_sessions(user_id=user_id)
        for session in result['sessions']:
            if session['$id'] == session_id:
                return True
        return False
    except:
        return False

def main(context):

    client = (
        Client()
        .set_endpoint("https://cloud.appwrite.io/v1")
        .set_project(os.environ["APPWRITE_FUNCTION_PROJECT_ID"])
        .set_key(os.environ["APPWRITE_API_KEY"])
    )

    note_id = context.req.query['noteId']
    owner_id = context.req.query['ownerId']
    session_id = context.req.query['sessionId']


    if((not note_id) or (not owner_id) or (not session_id)):
        return context.res.send("Invalid Request", 400)


    databases = Databases(client)
    users = Users(client)

    result = databases.get_document(
        database_id = os.environ["VITE_DATABASE_ID"],
        collection_id = os.environ["VITE_NOTES_COLLECTION_ID"],
        document_id = note_id
    )

    if(not result):
        return context.res.send("Invalid ID provided!", 400)


    perms = result["$permissions"]

    is_owner = (Permission.delete(Role.user(owner_id)) in perms)
    is_authed = validate_session(users,owner_id,session_id)

    context.log(is_owner)
    context.log(is_authed)

    if((not is_owner) or (not is_authed)):
        return context.res.send("Unauthorized Access!", 401)


    filename = result['title'].replace(" ","_") + '.pdf'
    generate_pdf(result, filename)

    try:
        with open(filename, 'rb') as pdf_file:
            pdf_data = pdf_file.read()
        
        return context.res.send(
            pdf_data, 
            200, 
            {
                "content-type": "application/pdf",
                "content-disposition": f"attachment; filename={filename}"
            }
        )
    except Exception as e:
        return context.res.send(f"Error generating PDF: {str(e)}", 500)

    # Optionally, clean up the file after sending
    finally:
        if os.path.exists(filename):
            os.remove(filename)


