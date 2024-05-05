MyStore application:

It is an application that can be used to upload files to your database and manage them in your database. Authorization and authentication are also used here.

POST /register

Payload: { name: string, password: string, role: string }

Response (Success): { status: "success", message: "Registration Success", role: string, Token: string }

Response (Failure): { status: "failed", message: "Username already exists" } or { status: "failed", message: "All fields are required" }

POST /login

Payload: { name: string, password: string }

Response (Success): { status: "success", message: "Login Success", role: string, Token: string }

Response (Failure): { status: "failed", message: "You are not a Registered User" } or { status: "failed", message: "All Fields are Required" }

PUT /uploads

Payload: FormData with "profile" field containing the file to upload and "name" field containing the username

Response (Success): { success: 1, profile_url: string, isUploaded: boolean }

Response (Failure): { success: 0, message: "Unable to Upload" }

GET /getBuckets

No payload

Response (Success): Array of bucket objects containing bucket details

Response (Failure): { message: "No buckets found" }

GET /getAllFiles

No payload

Response (Success): Array of file objects containing file details

Response (Failure): { message: "No buckets found" }

GET /getFileByName

Payload: { name: string, filename: string }

Response (Success): File object containing file details

Response (Failure): { message: "No File found" }

DELETE /deleteFile

Payload: { name: string, filename: string }

Response (Success): { isDeleted: boolean, message: "Deleted Successfully" }

Response (Failure): { message: "Could not delete File" }

GET /loggeduser

No payload

Response: { user: object }

GET /transactionLogs

No payload

Response: { data: { isAdmin: true } }
