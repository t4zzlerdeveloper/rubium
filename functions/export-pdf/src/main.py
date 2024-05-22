from appwrite.client import Client, Databases
import os

def main(context):

    client = (
        Client()
        .set_endpoint("https://cloud.appwrite.io/v1")
        .set_project(os.environ["APPWRITE_FUNCTION_PROJECT_ID"])
        .set_key(os.environ["APPWRITE_API_KEY"])
    )

    databases = Databases(client)

    result = databases.get_document(
        database_id = os.environ["VITE_NOTES_DATABASE_ID"],
        collection_id = os.environ["VITE_NOTES_COLLECTION_ID"],
        document_id = '662f739d89b5571e1d82'
    )

    return context.res.json(
        {
            "test": "Hello, World!",
            "result": str(result),
        }
    )
