#!/bin/bash
echo "Starting Prisma setup..."
npx prisma generate
echo "Prisma client generated successfully!"

echo "Starting Next.js build..."
npx next build
echo "Build completed!"
