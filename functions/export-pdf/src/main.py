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


    # # You can log messages to the console
    # context.log("Hello, Logs!")

    # # If something goes wrong, log an error
    # context.error("Hello, Errors!")

    # # The `ctx.req` object contains the request data
    # if context.req.method == "GET":
    #     # Send a response with the res object helpers
    #     # `ctx.res.send()` dispatches a string back to the client
    #     return context.res.send("Hello, World!")

    # # `ctx.res.json()` is a handy helper for sending JSON
    # return context.res.json(
    #     {
    #         "motto": "Build like a team of hundreds_",
    #         "learn": "https://appwrite.io/docs",
    #         "connect": "https://appwrite.io/discord",
    #         "getInspired": "https://builtwith.appwrite.io",
    #     }
    )
