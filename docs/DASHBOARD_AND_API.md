# Dashboard & API Documentation

## Dashboard Creation Guide

### 1. Dashboard Layout Structure
```tsx
// app/dashboard/layout.tsx
import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/Navbar"

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
```

### 2. Creating Dashboard Forms

#### Basic Form Structure
```tsx
// components/forms/ProductForm.tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be positive"),
  description: z.string().optional(),
})

export function ProductForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // API call here
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  )
}
```

### 3. Form Components
```tsx
// Example form field components
<FormField
  control={form.control}
  name="name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Product Name</FormLabel>
      <FormControl>
        <Input placeholder="Enter product name" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### 4. Data Tables
```tsx
// components/tables/ProductsTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function ProductsTable({ data }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.price}</TableCell>
            <TableCell>
              {/* Action buttons */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
```

## API Handling Guide

### 1. API Route Structure
```typescript
// app/api/products/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const products = await prisma.product.findMany()
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const product = await prisma.product.create({
      data: body,
    })
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
```

### 2. API Middleware
```typescript
// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyAuth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")
  
  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    await verifyAuth(token)
    return NextResponse.next()
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid token" },
      { status: 401 }
    )
  }
}

export const config = {
  matcher: "/api/:path*",
}
```

### 3. API Client Functions
```typescript
// lib/api-client.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL

export const apiClient = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE}${endpoint}`)
    if (!response.ok) throw new Error("API Error")
    return response.json()
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("API Error")
    return response.json()
  },

  async put(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("API Error")
    return response.json()
  },

  async delete(endpoint: string) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("API Error")
    return response.json()
  },
}
```

### 4. Using API with React Query
```typescript
// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

export function useProducts() {
  const queryClient = useQueryClient()

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => apiClient.get("/api/products"),
  })

  const createProduct = useMutation({
    mutationFn: (data: any) => apiClient.post("/api/products", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })

  return {
    products: productsQuery.data,
    isLoading: productsQuery.isLoading,
    error: productsQuery.error,
    createProduct,
  }
}
```

### 5. Error Handling
```typescript
// lib/error-handling.ts
export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message)
    this.name = "APIError"
  }
}

export async function handleAPIResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json()
    throw new APIError(
      response.status,
      error.message || "An error occurred",
      error
    )
  }
  return response.json()
}
```

### 6. API Response Types
```typescript
// types/api.ts
export interface APIResponse<T> {
  data?: T
  error?: string
  status: "success" | "error"
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}
```

## Best Practices

### Dashboard Development
1. Use TypeScript for better type safety
2. Implement form validation using Zod
3. Use React Query for server state management
4. Implement proper loading and error states
5. Use components from your UI library consistently

### API Development
1. Always validate input data
2. Implement proper error handling
3. Use TypeScript interfaces for request/response types
4. Implement rate limiting for public endpoints
5. Use middleware for authentication/authorization
6. Keep API routes organized and documented
7. Implement proper CORS policies
8. Use environment variables for configuration

## Common Patterns

### Loading States
```tsx
function ProductsList() {
  const { products, isLoading, error } = useProducts()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  
  return <ProductsTable data={products} />
}
```

### Form Submission
```tsx
function CreateProduct() {
  const { createProduct } = useProducts()
  const [error, setError] = useState(null)

  async function handleSubmit(data) {
    try {
      await createProduct.mutateAsync(data)
      toast.success("Product created successfully")
    } catch (err) {
      setError(err.message)
      toast.error("Failed to create product")
    }
  }

  return (
    <ProductForm 
      onSubmit={handleSubmit}
      error={error}
      isLoading={createProduct.isLoading}
    />
  )
}
```

## Security Considerations

1. **Input Validation**
   - Always validate user input on both client and server
   - Use Zod for runtime type checking
   - Sanitize data before storing in database

2. **Authentication**
   - Implement proper JWT handling
   - Use secure HTTP-only cookies
   - Implement refresh token rotation

3. **Authorization**
   - Implement role-based access control
   - Check permissions on every protected route
   - Use middleware for consistent auth checks

4. **API Security**
   - Implement rate limiting
   - Use CORS properly
   - Validate API tokens
   - Implement request sanitization
