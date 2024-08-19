
# Imeardle

Imeardle is a web application where users can guess the song based on a short audio clip. This project is built using Next.js and integrates with various services such as Cloudinary for media storage and Google for authentication.

## Technologies
- **[Next.js 14](https://nextjs.org/)**
- **[Prisma](https://www.prisma.io/)**
- **[Scss](https://sass-lang.com/)**

---

## Requirements

To run the code in this repository, you need to have the following:

- **Node.js (v14 or higher)**
- **Relational Database**: Any relational database that works with [Prisma](https://www.prisma.io/), I used MySQL
- **Cloudinary Account**: Used for media storage
- **Google API Credentials**: Used for handling user authentication via Google.

## Setup

 - Clone the repository:
    ```bash
    git clone https://github.com/Rensvdk20/Imeardle.git
    ```

- Install dependencies:
    ```bash
    npm install
    ```

- Set up environment variables:
    - Create a `.env` file in the root directory.
    - Add the following variables:

        ```properties
        # Database
        DATABASE_URL=<Your database URL>

        # Cloudinary
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<Your Cloudinary cloud name>
        NEXT_PUBLIC_CLOUDINARY_API_KEY=<Your Cloudinary API key>
        CLOUDINARY_API_SECRET=<Your Cloudinary API secret>
        CLOUDINARY_IMAGES_DIRECTORY=<Your Cloudinary images directory>

        # NextAuth
        GOOGLE_CLIENT_ID=<Your Google client ID>
        GOOGLE_CLIENT_SECRET=<Your Google client secret>
        NEXTAUTH_SECRET=<Your NextAuth secret>
        ```

## Usage

To start the development server, run:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.
