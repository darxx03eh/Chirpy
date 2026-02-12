# Authentication

- HTTP Authentication, scheme: bearer

# users

## PUT update user password or email

PUT /api/users

> Body Parameters

```json
{
  "email": "darxx03eh@gmail.com",
  "password": "mahmoud003+-"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|

> Response Examples

> 200 Response

```json
{
  "id": "1db4c364-4cd8-4e77-9c80-d0efe25aee51",
  "email": "darxx03eh@gmail.com",
  "createdAt": "2026-02-12T15:51:07.590Z",
  "updatedAt": "2026-02-12T14:10:47.513Z",
  "isChirpyRed": true
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# chirps

## POST create chirp

POST /api/chirps

> Body Parameters

```json
{
  "body": "If you're committed enough, you can make any story work."
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|Authorization|header|string| no |none|
|body|body|object| yes |none|

> Response Examples

> 200 Response

```json
{
  "id": "d29b278f-e2ba-4601-bb4f-4aaaab4c0b38",
  "createdAt": "2026-02-11T15:01:02.296Z",
  "updatedAt": "2026-02-11T15:01:02.296Z",
  "body": "If you're committed enough, you can make any story work.",
  "userId": "ca5bcee4-1ec2-4d73-8591-b84b7a462546"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET get all chirps

GET /api/chirps

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|authorId|query|string| no |none|
|sort|query|string| no |none|

> Response Examples

> 200 Response

```json
[
  {
    "id": "48a01c12-bd54-4a9d-a1e4-344ccf68b95b",
    "createdAt": "2026-02-11T15:11:41.187Z",
    "updatedAt": "2026-02-11T15:11:41.187Z",
    "body": "If you're committed enough, you can make any story work.",
    "userId": "350b9828-50fe-4d5a-8dff-347a2bebfef0"
  },
  {
    "id": "8341531d-dc7a-4f70-af9d-c059b1f8a357",
    "createdAt": "2026-02-11T15:11:41.193Z",
    "updatedAt": "2026-02-11T15:11:41.193Z",
    "body": "I once told a woman I was Kevin Costner, and it worked because I believed it.",
    "userId": "350b9828-50fe-4d5a-8dff-347a2bebfef0"
  }
]
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET get chrip by id

GET /api/chirps/3ba162fc-2cbe-40ca-8e66-97c8c066137e

> Response Examples

> 200 Response

```json
{
  "error": "Chirp with id: 8341531d-dc7a-4f70-af9d-b059b1f8a357 not found"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## DELETE delete chirp

DELETE /api/chirps/3ba162fc-2cbe-40ca-8e66-97c8c066137e

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# auth

## POST register

POST /api/users

> Body Parameters

```json
{
  "email": "darxx03eh@gmail.com",
  "password": "123456789"
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|

> Response Examples

> 200 Response

```json
{
  "id": "b4869886-f156-4bf1-ade8-ff49f60de666",
  "createdAt": "2026-02-11T14:27:57.132Z",
  "updateAt": "2026-02-11T14:27:57.132Z",
  "email": "darawsheh003@gmail.com",
  "isChirpyRed": false
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST login

POST /api/login

> Body Parameters

```json
{
  "email": "darxx03eh@gmail.com",
  "password": "123456789",
  "expiresInSeconds": 3000
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|

> Response Examples

> 200 Response

```json
{
    "id": "1db4c364-4cd8-4e77-9c80-d0efe25aee51",
    "email": "darxx03eh@gmail.com",
    "createdAt": "2026-02-12T15:51:07.590Z",
    "updatedAt": "2026-02-12T14:10:47.513Z",
    "isChirpyRed": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjaGlycHkiLCJzdWIiOiIxZGI0YzM2NC00Y2Q4LTRlNzctOWM4MC1kMGVmZTI1YWVlNTEiLCJpYXQiOjE3NzA5MDU0NTcsImV4cCI6MTc3MDkwODQ1N30.n4jgD9Y7TyDRhDzjouqG0xGXvhAV8IoqFPnTcJxpyUU",
    "refreshToken": "2d09810f7108b618f01807f485a729d25e1071a873fa970d90621ffc751d683d"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST refresh token

POST /api/refresh

> Response Examples

> 200 Response

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjaGlycHkiLCJzdWIiOiIxZGI0YzM2NC00Y2Q4LTRlNzctOWM4MC1kMGVmZTI1YWVlNTEiLCJpYXQiOjE3NzA5MDc5MDQsImV4cCI6MTc3MDkxMTUwNH0.Puwfr4U_4htrXrmtdYLLoR3NzHNamgBGm6ShT-sQWok"
}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST revoke refresh token

POST /api/revoke

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## POST upgrade to chirpy red

POST /api/polka/webhooks

> Body Parameters

```json
{
  "event": "user.upgraded",
  "data": {
    "userId": "1db4c364-4cd8-4e77-9c80-d0efe25aee51"
  }
}
```

### Params

|Name|Location|Type|Required|Description|
|---|---|---|---|---|
|body|body|object| yes |none|

> Response Examples

> 200 Response

```json
"<!DOCTYPE html> <html lang=\"en\"> <head> <meta charset=\"utf-8\"> <title>Error</title> </head> <body> <pre>Cannot POST //api/polka/webhooks</pre> </body> </html>"
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# admin

## POST reset users

POST /admin/reset

> Response Examples

> 200 Response

```json
{}
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

## GET get number of site visited

GET /admin/metrics

> Response Examples

> 200 Response

```json
"<html> <body> <h1>Welcome, Chirpy Admin</h1> <p>Chirpy has been visited 3 times!</p> </body> </html>"
```

### Responses

|HTTP Status Code |Meaning|Description|Data schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### Responses Data Schema

# Data Schema

