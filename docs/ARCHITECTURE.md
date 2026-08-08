# สถาปัตยกรรม TanStack Router Boilerplate

เอกสารนี้อธิบายสถาปัตยกรรมของ Boilerplate ในระดับแนวคิดและระดับ Implementation เพื่อให้ทีมเข้าใจตรงกันว่าแต่ละส่วนรับผิดชอบอะไร ข้อมูลไหลผ่านระบบอย่างไร และเหตุใด Tech Stack แต่ละรายการจึงถูกเลือกมาใช้ร่วมกัน

Boilerplate นี้ออกแบบสำหรับ **Client-rendered React SPA** ที่ Deploy เป็น Static Assets และเชื่อมต่อ HTTP API โดยเน้น Type Safety, Runtime Validation, Predictable Data Flow, Feature Isolation และ Testability

> เอกสารนี้อธิบายระบบตามโค้ดปัจจุบันของ Repository หากทีมเปลี่ยน Convention, Dependency Boundary หรือ State Ownership ต้องอัปเดตเอกสารนี้พร้อมโค้ดใน Pull Request เดียวกัน

## 1. เป้าหมายของสถาปัตยกรรม

React SPA สามารถเริ่มต้นได้ง่าย แต่เมื่อระบบขยายมักพบปัญหาเดิมซ้ำ ๆ

1. Route, API, UI และ Business Logic ผูกกันจนแก้ส่วนหนึ่งกระทบหลายส่วน
2. Server State ถูกคัดลอกไปเก็บหลายที่ เช่น Context, Local State และ Global Store จนข้อมูลไม่ตรงกัน
3. URL ไม่สะท้อนสถานะหน้าจอ ทำให้ Refresh, Bookmark และ Back/Forward ทำงานไม่แน่นอน
4. TypeScript ตรวจได้เฉพาะ Compile Time แต่ข้อมูลจาก URL, Environment และ API ยังเป็น `unknown` ตอน Runtime
5. Component เรียก Axios โดยตรง ทำให้ Error Handling, Timeout และ Cancellation ไม่สม่ำเสมอ
6. Directory แบ่งตามชนิดไฟล์อย่างเดียว จนไม่เห็นขอบเขต Business Capability
7. Test พึ่ง Network จริง ทำให้ช้า ไม่เสถียร และจำลอง Error Case ได้ยาก
8. Shared Code ค่อย ๆ รู้จักทุก Feature จนกลายเป็น Dependency Hub ที่แก้ยาก

เป้าหมายของ Boilerplate จึงเป็นระบบที่มีคุณสมบัติดังนี้

- ทุก Boundary มีเจ้าของชัดเจน
- Dependency ไหลไปทิศทางเดียว
- URL เป็น Application State อย่างเป็นทางการ
- TanStack Query เป็น Source of Truth สำหรับ Server State
- External Data ถูก Validate ก่อนเข้าสู่ระบบ
- Feature สามารถพัฒนา ทดสอบ และลบออกได้เป็นหน่วย
- Infrastructure ถูกใช้งานผ่าน Contract กลาง
- CI ตรวจ Convention เดียวกับที่ทีมใช้ในเครื่อง
- การเพิ่ม Library ใหม่ต้องมีปัญหาที่ชัดเจน ไม่เพิ่มเพราะเป็นกระแส

## 2. ขอบเขตของ Boilerplate

### 2.1 สิ่งที่รองรับ

- React SPA ที่ Render ฝั่ง Browser
- Static Hosting เช่น CDN, Object Storage หรือ Platform ที่รองรับ SPA Rewrite
- REST/HTTP API
- Public Routes
- File-based Routing
- URL Search Parameters และ Path Parameters ที่ตรวจสอบ Type ได้
- Server-state Caching, Prefetching และ Mutations
- Feature-oriented Source Structure
- Light, Dark และ System Theme
- Unit, Integration และ End-to-End Tests
- CI Quality Gate

### 2.2 สิ่งที่ไม่ได้รวมมาให้

- SSR หรือ Streaming SSR
- TanStack Start
- Backend, BFF หรือ Server Functions
- Authentication Provider
- Authorization System
- Global Client Store
- Form Library
- Offline-first Database
- WebSocket หรือ Realtime Synchronization
- Design System Package สำหรับหลาย Repository

การไม่มีสิ่งเหล่านี้ไม่ใช่ข้อจำกัดโดยบังเอิญ แต่เป็นการรักษา Baseline ให้เล็กและมีขอบเขตชัดเจน ทีมควรเพิ่มเมื่อ Requirement จริงพิสูจน์ว่าจำเป็น

ตัวอย่างเช่น หากระบบต้องการ SSR, Server Actions หรือ Edge Runtime ควรประเมิน TanStack Start หรือ Framework ที่รองรับ Server Runtime แทนการยืด SPA Template นี้เกินขอบเขต

## 3. ภาพรวมระบบ

```text
ผู้ใช้
  │
  ▼
Browser URL
  │
  ├─ Path Parameters
  └─ Search Parameters
          │
          ▼
TanStack Router
  │  Validate URL ด้วย Zod
  │  เลือก Route Boundary
  │  เรียก Loader
  ▼
TanStack Query
  │  Query Key
  │  Cache
  │  Cancellation
  │  Retry Policy
  ▼
Feature API Client
  │  แปลง Input เป็น HTTP Request
  │  Parse Response Contract
  ▼
Shared Axios Client
  │  Base URL
  │  Timeout
  │  Transport Error Normalization
  ▼
HTTP API
```

เมื่อ Response กลับมา ข้อมูลจะไหลย้อนกลับดังนี้

```text
HTTP Response
  → Axios Transport
  → Zod Runtime Validation
  → Typed Feature Data
  → TanStack Query Cache
  → Route Component
  → Feature Page
  → UI Components
```

จุดสำคัญคือแต่ละขั้นมีหน้าที่เฉพาะ และไม่มีชั้นใดข้าม Boundary โดยไม่จำเป็น

## 4. หลักการสถาปัตยกรรม

### 4.1 Boundary-first

ระบบไม่ได้เริ่มจากคำถามว่า “จะวางไฟล์ไว้ Folder ไหน” แต่เริ่มจากคำถามว่า “ข้อมูลกำลังข้าม Boundary ใด”

Boundary หลักของระบบคือ

- URL → Route
- Route → Feature
- Feature → Shared Infrastructure
- HTTP Response → Domain Data
- Query Cache → UI
- Environment → Application Runtime

ทุก Boundary ต้องมี Contract ที่ตรวจสอบได้

ตัวอย่าง

```text
URL: /users?page=2&pageSize=10
          │
          ▼
Zod Search Schema
          │
          ▼
{ page: 2, pageSize: 10 }
```

```text
HTTP Response: unknown
          │
          ▼
usersListResponseSchema.parse(response.data)
          │
          ▼
UsersListResponse
```

### 4.2 Dependency Direction

ทิศทาง Dependency หลักคือ

```text
app → routes → features → shared
```

ความหมาย

- `app` ประกอบระบบและรู้จัก Infrastructure ระดับแอป
- `routes` รู้จัก Feature Public API เพื่อประกอบ URL กับหน้าจอ
- `features` ใช้ Shared Infrastructure และ UI Primitives
- `shared` ไม่รู้จัก Feature, Route หรือ Application Composition

กฎนี้ป้องกัน Circular Dependency และทำให้ Shared Layer ไม่กลายเป็นที่รวม Business Logic

### 4.3 Feature-oriented Architecture

Business Capability หนึ่งรายการควรอยู่รวมกันใน Vertical Slice

```text
src/features/todos/
├── api/
│   ├── client.ts
│   ├── contracts.ts
│   ├── mutations.ts
│   └── queries.ts
├── components/
├── pages/
└── index.ts
```

เมื่อ Requirement ของ Todos เปลี่ยน ไฟล์ส่วนใหญ่ควรเปลี่ยนภายใน `features/todos` ไม่กระจายไปยัง Root-level `components`, `services`, `types` และ `hooks`

### 4.4 URL เป็น State

State ที่ควรถูก Share, Bookmark, Refresh หรือควบคุมด้วย Browser History ต้องอยู่ใน URL

ตัวอย่าง

```text
/todos?page=2&pageSize=20&source=user&userId=5
```

URL นี้อธิบายหน้าจอได้โดยไม่ต้องพึ่ง State ที่ซ่อนอยู่ใน Component

เหมาะกับ

- Pagination
- Search Query
- Filter
- Sort
- Selected Tab
- Entity ID
- View Mode

ไม่เหมาะกับ

- Dialog เปิดหรือปิดชั่วคราว
- Hover State
- Draft Input ที่ยังไม่ Submit
- Animation State

### 4.5 Server State มีเจ้าของเดียว

ข้อมูลจาก API ไม่ควรถูกคัดลอกเข้า Context หรือ Global Store เพียงเพื่อให้หลายหน้าใช้งานร่วมกัน TanStack Query มีหน้าที่เป็นเจ้าของ

```text
Server State
  → TanStack Query Cache
  → Query Consumers
```

Component ควรอ่านข้อมูลจาก Query Key เดียวกัน แทนการเก็บสำเนาใน `useState`

### 4.6 Runtime Validation

TypeScript ไม่สามารถยืนยันว่า API ภายนอกส่งข้อมูลตรงตาม Type ตอน Runtime

โค้ดนี้ไม่ปลอดภัย

```ts
const response = await httpClient.get('/todos')
return response.data as TodosListResponse
```

เพราะ `as` ไม่ได้ตรวจข้อมูลจริง

แนวทางของ Boilerplate คือ

```ts
return todosListResponseSchema.parse(response.data)
```

เมื่อ API Contract เปลี่ยน ระบบจะ Fail ที่ Boundary พร้อมรายละเอียดที่ตรวจสอบได้ แทนการปล่อยข้อมูลผิดรูปเข้าสู่ UI

## 5. Directory และความรับผิดชอบ

```text
src/
├── app/
├── routes/
├── features/
├── shared/
├── styles/
├── test/
└── routeTree.gen.ts
```

### 5.1 `src/app` — Application Composition

`src/app` เป็น Composition Root ของ Frontend

รับผิดชอบ

- Router Creation
- Router Context
- QueryClient Defaults
- Application-wide Providers
- Bootstrap Configuration

ตัวอย่าง

```text
src/app/
├── query-client/
│   └── query-client.ts
└── router/
    ├── router-context.ts
    └── router.ts
```

Business Feature ห้ามอยู่ใน Layer นี้ เพราะ `app` ควรเปลี่ยนเมื่อวิธีประกอบระบบเปลี่ยน ไม่ใช่เมื่อ Requirement ของ Todos หรือ Orders เปลี่ยน

#### Provider Composition

`src/main.tsx` ประกอบ Provider ตามลำดับ

```text
ThemeProvider
  └─ QueryClientProvider
      └─ RouterProvider
```

ลำดับนี้มีความหมาย

- Theme Provider ครอบ UI ทั้งระบบ
- Route Components ต้องเข้าถึง Query Client
- Router Context รับ Query Client เพื่อใช้ใน Loader

Provider ใหม่ควรถูกวางระดับ Application เฉพาะเมื่อเป็น Cross-cutting Concern จริง เช่น Authentication, Internationalization หรือ Observability Context

### 5.2 `src/routes` — URL Ownership และ Orchestration

Route เป็นเจ้าของสัญญาระหว่าง URL กับหน้าจอ

Route สามารถรับผิดชอบ

- Path และ Search Parameter Validation
- Loader Dependencies
- Query Prefetch
- Pending Boundary
- Error Boundary
- Not-found Boundary
- การประกอบ Feature Page
- Navigation ที่เปลี่ยน URL State

Route ไม่ควรรับผิดชอบ

- เรียก Axios โดยตรง
- Parse API Response
- Business Calculation
- Mapping Domain Model จำนวนมาก
- Table Rendering
- Form Implementation

ตัวอย่างจาก `/users`

```ts
const usersSearchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  pageSize: z.coerce.number().int().min(5).max(50).catch(10),
})
```

Route Loader ใช้ Query Options จาก Feature

```ts
loaderDeps: ({ search }) => search,
loader: ({ context, deps }) =>
  context.queryClient.ensureQueryData(usersListQueryOptions(deps)),
```

Route ไม่ Fetch ซ้ำด้วย Axios แต่ใช้ Query Options เดียวกับ Component ทำให้ Loader และ Component อ้าง Cache Entry เดียวกัน

### 5.3 `src/features` — Business Capability

Feature เป็นเจ้าของความสามารถทางธุรกิจหนึ่งชุด

```text
src/features/users/
├── api/
│   ├── client.test.ts
│   ├── client.ts
│   ├── contracts.ts
│   └── queries.ts
├── components/
│   ├── users-table.test.tsx
│   └── users-table.tsx
├── pages/
│   └── users-page.tsx
└── index.ts
```

Feature รับผิดชอบ

- API Contracts
- API Client Functions
- Query Keys และ Query Options
- Mutations และ Cache Policy
- Domain Mapping
- Feature Components
- Feature Pages
- Feature-specific Hooks
- Public API

#### Feature Public API

Route ควร Import ผ่าน `index.ts`

```ts
import { UsersPage, usersListQueryOptions } from '#/features/users'
```

ไม่ควร Import Internal File โดยตรง

```ts
import { getUsers } from '#/features/users/api/client'
```

Public API ทำหน้าที่เป็น Boundary ระหว่าง Route กับ Feature และลดการผูกกับโครงสร้างภายใน

### 5.4 `src/shared` — Reusable Infrastructure และ Primitives

Shared Layer เหมาะกับสิ่งที่ไม่มีความหมายเฉพาะ Feature

ตัวอย่าง

```text
src/shared/
├── api/
│   └── http-client.ts
├── config/
│   └── env.ts
├── errors/
│   └── application-error.ts
├── lib/
├── theme/
└── ui/
```

เหมาะกับ

- HTTP Transport
- Environment Parsing
- Error Base Classes
- Utility Functions
- Theme Infrastructure
- UI Primitives

ไม่เหมาะกับ

- `TodoStatusBadge`
- `OrderSummary`
- `PatientSearch`
- `InvoiceCalculation`

สิ่งเหล่านี้มีความหมายทางธุรกิจและควรอยู่ใน Feature

#### Enforcement ด้วย ESLint

Repository ป้องกัน Shared Layer จากการ Import กลับขึ้นไปหา Layer ด้านบน

```text
shared ห้าม import app, routes หรือ features
```

และป้องกัน Axios Import ทั่ว `src` ยกเว้น `src/shared/api/http-client.ts`

กฎนี้ทำให้ Architecture เป็น Executable Constraint ไม่ใช่เพียงข้อความในเอกสาร

## 6. Data Flow แบบละเอียด

ตัวอย่างการเปิด URL

```text
/users?page=2&pageSize=10
```

### ขั้นที่ 1: Router อ่าน URL

TanStack Router เลือก Route `/users`

### ขั้นที่ 2: Route Validate Search

```ts
validateSearch: (search) => usersSearchSchema.parse(search)
```

ค่าที่ไม่ถูกต้องถูก Normalize ด้วย Zod

```text
/users?page=abc&pageSize=999
```

กลายเป็นค่าที่ Schema กำหนดแทนการปล่อย String ที่ไม่แน่นอนเข้าสู่ระบบ

### ขั้นที่ 3: Loader สร้าง Query Dependency

```ts
loaderDeps: ({ search }) => search
```

เมื่อ `page` หรือ `pageSize` เปลี่ยน Loader รู้ว่าต้องประเมิน Query ใหม่

### ขั้นที่ 4: Loader Prefetch

```ts
context.queryClient.ensureQueryData(usersListQueryOptions(deps))
```

`ensureQueryData` จะ

- คืน Cache ถ้ามีข้อมูลที่ใช้ได้
- เรียก Query Function หากไม่มี
- ส่ง Promise ให้ Router Pending Boundary
- ส่ง Error ให้ Route Error Boundary

### ขั้นที่ 5: Query Function เรียก Feature Client

```ts
queryFn: ({ signal }) => getUsers({ ...input, signal })
```

`AbortSignal` ถูกส่งต่อไปยัง Axios เมื่อ Navigation เปลี่ยนหรือ Query ถูกยกเลิก Request ที่ไม่จำเป็นสามารถหยุดได้

### ขั้นที่ 6: Shared Transport ส่ง HTTP Request

```ts
httpClient.get('/users', {
  params: { limit, skip },
  signal,
})
```

Shared Client เป็นเจ้าของ

- Base URL
- Timeout
- Default Headers
- Network Error Normalization
- HTTP Error Normalization

### ขั้นที่ 7: Feature Validate Response

```ts
usersListResponseSchema.parse(response.data)
```

ข้อมูลที่ออกจาก Client Function จึงเป็น Typed Data ที่ผ่าน Runtime Validation แล้ว

### ขั้นที่ 8: Query Cache เก็บข้อมูล

Cache Key ประกอบด้วย Input

```ts
;['users', 'list', { page: 2, pageSize: 10 }]
```

หน้า 1 และหน้า 2 จึงไม่ชนกัน

### ขั้นที่ 9: Component Consume Cache

```ts
const { data } = useSuspenseQuery(usersListQueryOptions(search))
```

Loader และ Component ใช้ Query Options เดียวกัน จึงไม่เกิด Query Contract สองชุด

## 7. State Ownership

State แต่ละประเภทต้องมีเจ้าของที่เหมาะสม

| State                   | เจ้าของ                               | ตัวอย่าง                      |
| ----------------------- | ------------------------------------- | ----------------------------- |
| Server State            | TanStack Query                        | Users, Todos, API Metadata    |
| URL State               | TanStack Router                       | Page, Page Size, Filter, Sort |
| Form Draft              | Local State หรือ Feature Form Library | Todo Text ก่อน Submit         |
| Ephemeral UI State      | React Local State                     | Dialog, Expanded Row          |
| Theme Preference        | Theme Provider + Local Storage        | Light, Dark, System           |
| Cross-page Client State | Store ที่เลือกภายหลัง                 | Complex Editor Session        |

### เมื่อใดไม่ควรเพิ่ม Global Store

ไม่ควรเพิ่ม Store เพียงเพื่อ

- เก็บ API Response
- เก็บ Pagination
- เก็บ Search Query
- แชร์ข้อมูลที่ Query Cache มีอยู่แล้ว
- ส่ง Props ผ่าน Component เพียงหนึ่งหรือสองระดับ

ควรเพิ่มเมื่อมี Client State ระยะยาวที่

- ไม่ใช่ Server State
- ไม่ควรอยู่ใน URL
- ถูกแก้จากหลายส่วนของระบบ
- มี State Transition ที่ซับซ้อน
- ต้อง Persist หรือ Undo/Redo

ก่อนเพิ่ม Store ควรเขียน Architecture Decision Record อธิบายปัญหาและทางเลือกที่พิจารณา

## 8. TanStack Router Architecture

### 8.1 File-based Routing

Route File เป็นเจ้าของ URL Segment โดยตรง และ Plugin สร้าง `src/routeTree.gen.ts`

ข้อดี

- Route Structure มองเห็นจาก File System
- Link และ Navigate ตรวจ Path/Params/Search ได้
- Route Tree Generate อัตโนมัติ
- Code Splitting ทำได้ตาม Route
- Refactor URL ได้โดย TypeScript ช่วยตรวจ

`routeTree.gen.ts` เป็น Generated File ห้ามแก้ด้วยมือ

### 8.2 Router Context

Router รับ Query Client ผ่าน Context

```ts
context: {
  queryClient,
}
```

Loader จึง Prefetch ได้โดยไม่เรียก React Hook

หากภายหลังเพิ่ม Authentication สามารถเพิ่ม Session Capability ใน Router Context แทนการ Import Provider SDK เข้า Route Loader

### 8.3 Intent Preloading

Router ตั้งค่า

```ts
defaultPreload: 'intent'
```

เมื่อผู้ใช้แสดง Intent เช่น Hover หรือ Focus Link ระบบสามารถเริ่มโหลด Route ก่อน Click ทำให้ Navigation ตอบสนองเร็วขึ้น โดยไม่ Prefetch ทุก Route ตั้งแต่เริ่มต้น

### 8.4 Scroll Restoration

```ts
scrollRestoration: true
```

Router จัดการตำแหน่ง Scroll ให้สอดคล้องกับ Browser Navigation แทนการเขียน Side Effect ในแต่ละหน้า

## 9. TanStack Query Architecture

### 9.1 Query Key Factory

ทุก Feature ควรมี Query Key Factory

```ts
export const todosKeys = {
  all: ['todos'] as const,
  lists: () => [...todosKeys.all, 'list'] as const,
  list: (input: TodosListInput) => [...todosKeys.lists(), input] as const,
  details: () => [...todosKeys.all, 'detail'] as const,
  detail: (todoId: number) => [...todosKeys.details(), todoId] as const,
}
```

ข้อดี

- ลด Typo
- ทำ Partial Invalidation ได้
- แยก List และ Detail ชัดเจน
- Cache Key ผูกกับ Input อย่างเป็นระบบ

### 9.2 Query Options เป็น Contract กลาง

```ts
export function todoDetailQueryOptions(todoId: number) {
  return queryOptions({
    queryKey: todosKeys.detail(todoId),
    queryFn: ({ signal }) => getTodo({ todoId, signal }),
  })
}
```

ใช้ได้ทั้ง

- Route Loader
- `useQuery`
- `useSuspenseQuery`
- Prefetch
- Tests

### 9.3 Query Defaults

Query Client กำหนด Baseline

```text
staleTime = 30 วินาที
gcTime = 5 นาที
refetchOnWindowFocus = false
retry เฉพาะ Error ที่ควรลองใหม่
```

`ApplicationError` ที่มี HTTP Status ต่ำกว่า 500 ไม่ถูก Retry เพราะ Client Error เช่น 400 หรือ 404 มักไม่ดีขึ้นจากการยิง Request ซ้ำ

Mutation ไม่ Retry อัตโนมัติ เพื่อลดความเสี่ยงจาก Duplicate Write

### 9.4 Mutation และ Cache Consistency

Mutation ต้องประกาศ Cache Policy อย่างชัดเจน

ทางเลือกหลัก

- `setQueryData` เมื่อ Server คืน Resource ล่าสุด
- `invalidateQueries` เมื่อไม่สามารถคำนวณผลลัพธ์ทุก List ได้อย่างปลอดภัย
- Optimistic Update เมื่อ UX ต้องการและมี Rollback Strategy
- `removeQueries` เมื่อ Resource ถูกลบ

ห้ามเรียก Mutation แล้วหวังว่า UI จะอัปเดตเองโดยไม่มี Cache Policy

## 10. API และ Runtime Contract

### 10.1 Shared HTTP Client

Axios ถูกจำกัดให้อยู่ใน Shared Transport

```text
Feature Client
  → shared/http-client
  → Axios
```

เหตุผล

- Base URL จุดเดียว
- Timeout จุดเดียว
- Error Normalization จุดเดียว
- Interceptor ไม่กระจาย
- สามารถเพิ่ม Token, Correlation ID หรือ Telemetry ภายหลังได้
- Feature ไม่ผูกกับ Axios API โดยตรง

### 10.2 Feature Client

Feature Client แปลง Domain Input เป็น Transport Request

```ts
export async function getTodos(input: GetTodosInput): Promise<TodosListResponse> {
  const response = await httpClient.get('/todos', config)
  return todosListResponseSchema.parse(response.data)
}
```

Feature Client ไม่ควรคืน `AxiosResponse` เพราะจะทำให้ Transport Detail รั่วเข้า Query และ UI

### 10.3 Zod Contract

Schema เป็น Runtime Contract และเป็นแหล่งกำเนิด Type

```ts
export const todoSchema = z.object({
  id: z.coerce.number().int().positive(),
  todo: z.string().min(1),
  completed: z.boolean(),
  userId: z.coerce.number().int().positive(),
})

export type Todo = z.infer<typeof todoSchema>
```

ไม่ควรเขียน Interface ซ้ำกับ Schema เพราะอาจเปลี่ยนไม่พร้อมกัน

### 10.4 Environment Contract

Environment ถูก Parse ด้วย Zod ก่อน Application เริ่มทำงาน

```ts
const envSchema = z.object({
  VITE_APP_NAME: z.string().trim().min(1),
  VITE_API_BASE_URL: z.url(),
  VITE_API_TIMEOUT_MS: z.coerce.number().int().positive(),
})
```

ตัวแปร `VITE_*` ถูกฝังใน Browser Bundle จึงห้ามใส่ Secret, Private Key หรือ Privileged Token

## 11. Error Architecture

### 11.1 Error Categories

`ApplicationError` แบ่ง Error เป็น

- `NETWORK_ERROR`
- `HTTP_ERROR`
- `API_CONTRACT_ERROR`
- `UNKNOWN_ERROR`

### 11.2 Transport Error

Shared Axios Interceptor แปลง Network และ HTTP Failure เป็น `ApplicationError`

ผลลัพธ์คือ Feature และ Route ไม่ต้องรู้จัก `AxiosError`

### 11.3 Contract Error

เมื่อ Zod Parse ไม่ผ่าน Feature Client สร้าง Error แบบ

```text
code = API_CONTRACT_ERROR
```

Error นี้หมายถึง API Response ไม่ตรงกับ Contract ที่ Frontend รองรับ ไม่ใช่ปัญหา Network

### 11.4 Presentation Error

Route Error Boundary แสดงข้อความปลอดภัยต่อผู้ใช้

```tsx
errorComponent: ({ error, reset }) => <ErrorState message={error.message} onRetry={reset} />
```

ระบบจริงควรส่ง Cause, Status และ Contract Details ไป Observability Tool โดยไม่แสดงข้อมูลภายในทั้งหมดต่อผู้ใช้

## 12. UI Architecture

### 12.1 Tailwind CSS v4

Tailwind เหมาะกับ Boilerplate เพราะ

- Style อยู่ใกล้ Component
- Design Token ใช้ผ่าน CSS Variables
- Dark Mode ทำงานผ่าน Theme Class
- ลดการสร้าง CSS Abstraction ก่อนรู้ Pattern จริง
- Production Build ตัด Class ที่ไม่ใช้

Tailwind ไม่ได้แทน Design System การตั้งชื่อ Token, Component API และ Accessibility ยังต้องมี Convention ของทีม

### 12.2 shadcn/ui

shadcn/ui นำ Component Source Code เข้ามาอยู่ใน Repository

ข้อดี

- ทีมเป็นเจ้าของ Source
- ปรับ Design Token และ Behavior ได้
- ไม่ถูกจำกัดด้วย API ของ Component Package ภายนอก
- Review การเปลี่ยนแปลงผ่าน Git ได้

ข้อควรระวัง

- Component ที่ Generate มาไม่ใช่ Dependency แบบ Black Box
- ต้อง Review Accessibility และ Import Path
- Primitive ห้ามมี Business Logic
- การ Update ต้องตรวจ Diff ไม่ควร Overwrite โดยไม่ Review

### 12.3 Radix UI

Radix เป็น Headless Accessibility Primitive สำหรับ Interaction ที่ซับซ้อน เช่น Dropdown Menu, Dialog และ Slot Composition

เหมาะเพราะแยก Behavior ออกจาก Visual Style ทำให้ shadcn และ Tailwind ควบคุมหน้าตาได้ โดยไม่ต้องเขียน Keyboard Navigation และ ARIA Pattern ใหม่ทั้งหมด

### 12.4 Theme Provider

Theme Provider เป็นเจ้าของ

- `light`
- `dark`
- `system`
- Local Storage Preference
- `<html>` Theme Class
- System Theme Change Listener

Theme เป็น Cross-cutting UI Concern จึงอยู่ใน Shared Layer และถูกประกอบที่ Application Root

### 12.5 Feature UI กับ Shared UI

```text
shared/ui/button.tsx        Primitive
shared/ui/card.tsx          Primitive
features/todos/todo-row.tsx Business Component
features/orders/order-card  Business Component
```

กฎง่าย ๆ คือ หากชื่อ Component มีศัพท์ทางธุรกิจ ควรอยู่ใน Feature

## 13. TypeScript Architecture

Repository เปิด Strict Options เพิ่มเติม

- `strict`
- `noUncheckedIndexedAccess`
- `exactOptionalPropertyTypes`
- `useUnknownInCatchVariables`
- `noUncheckedSideEffectImports`
- `noFallthroughCasesInSwitch`

เหตุผล

### `noUncheckedIndexedAccess`

การเข้าถึง Array หรือ Record ต้องยอมรับว่าอาจได้ `undefined`

### `exactOptionalPropertyTypes`

แยกความหมายระหว่าง “ไม่มี Property” กับ “Property มีค่า `undefined`” ซึ่งสำคัญต่อ Request Config และ Partial Update

### `useUnknownInCatchVariables`

บังคับ Narrow Error ก่อนอ่าน Property ลดการสมมติว่า Error ทุกชนิดเป็น `Error`

### Path Alias

```ts
import { httpClient } from '#/shared/api/http-client'
```

Path Alias ลด Relative Import หลายระดับและทำให้ Dependency Direction อ่านง่ายขึ้น

## 14. Build และ Runtime Tooling

### 14.1 Bun

Bun ใช้เป็น Package Manager และ Script Runtime

เหมาะเพราะ

- ติดตั้ง Dependency เร็ว
- รัน Script ได้โดยตรง
- ใช้คำสั่งเดียวใน Local และ CI
- Lockfile รองรับ Reproducible Installation เมื่อโปรเจ็กต์เลือก Commit

Boilerplate ปัจจุบันให้ Repository ที่สร้างจาก Template เป็นผู้ตัดสินใจสร้างและ Commit `bun.lock` ของตนเอง

### 14.2 Vite

Vite เหมาะกับ Client-rendered SPA เพราะ

- Development Server เริ่มเร็ว
- ESM-native Workflow
- HMR เร็ว
- Plugin Ecosystem รองรับ React, TanStack Router และ Tailwind
- Production Build เรียบง่ายสำหรับ Static Assets

### 14.3 React 19

React ทำหน้าที่เป็น UI Runtime และ Composition Model

Boilerplate ใช้ React สำหรับ

- Component Composition
- Suspense-compatible Query Consumption
- Context สำหรับ Cross-cutting UI Concern
- Local State สำหรับ Ephemeral State

React ไม่ได้ถูกใช้เป็น Server-state Store หรือ Router เพราะมีเครื่องมือเฉพาะที่เหมาะกว่า

## 15. Testing Architecture

### 15.1 Test Pyramid

```text
           E2E
        Integration
     Component / Unit
```

ไม่จำเป็นต้องมีจำนวนเท่ากันทุกระดับ

- Unit Test ตรวจ Pure Logic
- Component Test ตรวจ Rendering และ Interaction
- API Integration Test ตรวจ Client + Zod + MSW
- E2E ตรวจ User Journey สำคัญ

### 15.2 Vitest

Vitest ใช้ Runtime และ Transformation ใกล้เคียง Vite ทำให้ Test TypeScript/React ได้โดยไม่สร้าง Build Pipeline แยก

### 15.3 Testing Library

Testing Library เน้นสิ่งที่ผู้ใช้มองเห็นและโต้ตอบ แทนการ Test Internal State ของ Component

ควร Query ด้วย Role, Label และ Visible Text ก่อน Test ID

### 15.4 MSW

MSW Mock ที่ Network Boundary

```text
Feature Client → Axios → MSW Handler
```

ข้อดี

- Test ใช้ Client Function จริง
- ตรวจ URL, Method และ Payload ได้
- จำลอง Success, Error และ Invalid Contract ได้
- ไม่ Mock Axios Implementation Detail
- `onUnhandledRequest: 'error'` ป้องกัน Test หลุดไป Network จริง

### 15.5 Playwright

Playwright ตรวจ Browser Flow จริง

เหมาะกับ

- Navigation
- URL State
- Theme Persistence
- Form Submission
- Critical User Journey

ไม่ควรใช้ E2E Test ทุก Edge Case เพราะช้าและดูแลยาก ควรเก็บ Logic และ Contract Cases ไว้ที่ระดับต่ำกว่า

## 16. CI และ Quality Gate

คำสั่งหลักคือ

```bash
bun run check
```

ประกอบด้วย

```text
Prettier
  → ESLint
  → Route Generation
  → TypeScript
  → Vitest
  → Production Build
```

E2E แยกเป็นอีก Job เพื่อให้เห็น Failure Boundary ชัดเจน

CI ปัจจุบันใช้ `bun install` เพราะ Template ไม่บังคับ Lockfile เมื่อสร้าง Repository จริงและ Commit `bun.lock` แล้ว ควรเปลี่ยนเป็น

```bash
bun install --frozen-lockfile
```

Quality Gate ไม่ได้พิสูจน์ว่า Business Requirement ถูกต้องทั้งหมด แต่ป้องกัน Regression พื้นฐานและ Convention Drift

## 17. Deployment Architecture

Production Build สร้าง Static Assets ใน `dist/`

Hosting Platform ต้องรองรับ SPA Rewrite

```text
unknown path → /index.html
```

หากไม่ตั้งค่า การเปิด `/users?page=2` โดยตรงจะได้ 404 จาก Hosting แม้ Client Router รองรับ Route นั้น

สิ่งที่ต้องกำหนดตาม Environment

- API Base URL
- API CORS
- Content Security Policy
- Cache Headers
- Source-map Policy
- Error Monitoring
- Deployment Approval

ห้ามเก็บ Secret ใน Frontend Environment เพราะค่าใน Browser Bundle อ่านได้โดยผู้ใช้

## 18. การเพิ่ม Authentication ภายหลัง

Boilerplate นี้ยังไม่มี Authentication Provider

หากระบบต้องเพิ่ม Clerk, Auth0 หรือระบบองค์กร ควรรักษา Boundary ดังนี้

```text
Provider SDK
  → Adapter ใน src/app/providers
  → Provider-neutral Contract ใน src/shared/auth
  → Router Context
  → Route Guards
```

Feature ไม่ควร Import Authentication SDK โดยตรง เพราะจะทำให้ Business Capability ผูกกับ Vendor และทดสอบยาก

Frontend Route Guard มีหน้าที่ควบคุม Navigation และ UX เท่านั้น Backend ต้องตรวจ Session Token และ Permission ทุก Request ที่มีข้อมูลป้องกัน

## 19. เหตุผลที่ Tech Stack เหมาะกับสถาปัตยกรรมนี้

| Tech Stack            | หน้าที่                        | เหตุผลที่เหมาะสม                                                               |
| --------------------- | ------------------------------ | ------------------------------------------------------------------------------ |
| React 19              | UI Composition                 | Component Model ชัดเจนและทำงานกับ Suspense/Provider Ecosystem                  |
| TypeScript            | Static Contract                | ตรวจ Dependency, Route Type, Query Input และ Component Props ก่อน Runtime      |
| Vite                  | Dev Server และ Build           | เหมาะกับ Browser SPA, HMR เร็ว และ Plugin Integration ตรงไปตรงมา               |
| Bun                   | Package Manager/Script Runtime | Workflow Local และ CI กระชับ ติดตั้งและรัน Script เร็ว                         |
| TanStack Router       | URL และ Navigation             | Type-safe Route, Search Validation, Loader, Preload และ Code Splitting         |
| TanStack Query        | Server State                   | Cache, Deduplication, Retry, Cancellation, Invalidation และ Mutation Lifecycle |
| Zod                   | Runtime Validation             | เชื่อม Runtime Contract กับ TypeScript Type โดยไม่เขียนซ้ำ                     |
| Axios                 | HTTP Transport                 | Config กลาง, Timeout, Interceptor, AbortSignal และ Error Metadata              |
| Tailwind CSS v4       | Styling                        | ใช้ Token ผ่าน CSS Variables และสร้าง UI ได้ใกล้ Component                     |
| shadcn/ui             | Owned UI Source                | ปรับแต่งได้เต็มที่และไม่ซ่อน Source Code ไว้ใน Package                         |
| Radix UI              | Accessible Primitives          | ให้ Interaction/ARIA Foundation โดยไม่บังคับ Visual Style                      |
| Lucide React          | Iconography                    | API สม่ำเสมอ, Tree-shakable และเหมาะกับ Component Model                        |
| Vitest                | Unit/Integration Test          | ใช้ Toolchain ใกล้ Vite และทำงานกับ TypeScript ได้ดี                           |
| Testing Library       | Component Test                 | เน้น Behavior ที่ผู้ใช้รับรู้ ลดการผูกกับ Implementation Detail                |
| MSW                   | Network Mock                   | Mock ที่ HTTP Boundary และใช้ Client Function จริง                             |
| Playwright            | Browser E2E                    | ตรวจ Navigation, Storage, DOM และ User Journey ใน Browser จริง                 |
| ESLint                | Static Convention              | บังคับ Import Boundary และป้องกัน Pattern ที่ผิด Architecture                  |
| Prettier              | Formatting                     | ลด Style Debate และทำให้ Diff เน้นการเปลี่ยนแปลงเชิงความหมาย                   |
| Router/Query Devtools | Development Diagnostics        | ตรวจ Route State, Loader, Query Key และ Cache ได้โดยตรง                        |

Tech Stack เหล่านี้ไม่ควรทำหน้าที่ทับซ้อนกัน

```text
Router ไม่เป็น Server-state Cache
Query ไม่เป็น URL Store
React Context ไม่เป็น API Cache
Zod ไม่เป็น Business Workflow Engine
Axios ไม่เป็น Domain Layer
Shared UI ไม่เป็น Feature Layer
```

## 20. Anti-pattern ที่ควรหลีกเลี่ยง

### Component เรียก Axios โดยตรง

```tsx
useEffect(() => {
  axios.get('/todos').then(...)
}, [])
```

ปัญหา

- ไม่มี Query Cache
- ไม่มี Contract Validation
- Cancellation ไม่สม่ำเสมอ
- Error Handling กระจาย

### Route มี Business Logic

```ts
loader: async () => {
  const response = await axios.get('/todos')
  return response.data.map(calculatePriority)
}
```

Route ควร Orchestrate Feature Query ไม่ควรเป็น Service Layer

### เก็บ Pagination ใน Local State

```ts
const [page, setPage] = useState(1)
```

หาก Page ต้อง Refresh/Bookmark/Share ควรอยู่ใน URL

### Copy Query Data เข้า State

```ts
const { data } = useQuery(...)
const [todos, setTodos] = useState(data)
```

สร้าง Source of Truth สองชุดและต้อง Synchronize เอง

### Shared Import Feature

```ts
// shared/ui/menu.tsx
import { TodoStatusBadge } from '#/features/todos'
```

ทำให้ Shared ไม่เป็น Reusable Infrastructure อีกต่อไป

### Cast Response ด้วย `as`

```ts
return response.data as Todo
```

ไม่ตรวจ Runtime และซ่อน Contract Drift

### Invalidate ทุก Query หลังทุก Mutation

```ts
queryClient.invalidateQueries()
```

กว้างเกินไป ทำให้ Request เพิ่มและซ่อน Cache Design ที่ไม่ชัดเจน

## 21. วิธีตัดสินใจเพิ่มเครื่องมือใหม่

ก่อนเพิ่ม Dependency ให้ตอบคำถาม

1. ปัญหาปัจจุบันคืออะไร
2. แก้ด้วยสิ่งที่มีอยู่ไม่ได้เพราะอะไร
3. Tool ใหม่เป็นเจ้าของ State หรือ Boundary ใด
4. ซ้ำหน้าที่กับ Router, Query, Zod หรือ React หรือไม่
5. Testing Strategy เปลี่ยนอย่างไร
6. Bundle และ Maintenance Cost เท่าใด
7. Removal Strategy คืออะไร

ตัวอย่าง

### เพิ่ม Form Library

เหมาะเมื่อ

- Form มีหลาย Field
- Validation ซับซ้อน
- มี Field Array
- ต้องจัดการ Touched/Dirty/Error อย่างเป็นระบบ

ไม่จำเป็นสำหรับ Form สั้นสองหรือสาม Field

### เพิ่ม TanStack DB

เหมาะเมื่อ

- ต้องมี Normalized Collection
- Live Query
- Optimistic Local Writes จำนวนมาก
- Offline-first
- Synchronization Engine

CRUD REST ทั่วไปควรเริ่มจาก TanStack Query

### เพิ่ม Global Store

เหมาะเมื่อ Client State ซับซ้อนและไม่เข้ากับ URL, Query หรือ Local State จริง

## 22. ขั้นตอนเพิ่ม Feature ใหม่

1. ระบุ URL และ User Flow
2. ระบุ API Endpoints
3. สร้าง Runtime Contracts
4. สร้าง Feature Client Functions
5. สร้าง Query Keys และ Query Options
6. สร้าง Mutation และ Cache Policy
7. สร้าง Feature Components
8. สร้าง Feature Pages
9. Export Public API ผ่าน `index.ts`
10. สร้าง Route และ Validate URL
11. Prefetch ผ่าน Route Loader
12. เพิ่ม Navigation
13. เพิ่ม MSW Handlers
14. เพิ่ม Tests ตามความเสี่ยง
15. รัน Quality Gate
16. อัปเดตเอกสารหากเพิ่ม Convention ใหม่

## 23. Definition of Done เชิงสถาปัตยกรรม

Feature พร้อม Merge เมื่อ

- URL และ Search Parameters ถูก Validate
- API Input และ Response มี Runtime Contract
- Type Infer จาก Schema แทนการเขียนซ้ำ
- Query Key มี Factory กลาง
- Loader และ Component ใช้ Query Options เดียวกัน
- Request รองรับ AbortSignal
- Mutation มี Cache Policy ชัดเจน
- Loading, Error, Empty และ Success State ครบ
- Route ไม่มี Axios Import
- Component ไม่มี Axios Import
- Shared ไม่ Import Feature หรือ Route
- Feature Export เฉพาะ Public API
- MSW ไม่ปล่อย Unhandled Request
- Tests ครอบคลุม Critical Flow
- `bun run check` ผ่าน
- `bun run test:e2e` ผ่าน
- เอกสารได้รับการอัปเดตเมื่อ Architecture เปลี่ยน

## 24. สรุป Mental Model

จดจำระบบนี้ด้วย Flow ต่อไปนี้

```text
URL เป็น State
  → Router Validate และ Orchestrate
  → Query เป็นเจ้าของ Server State
  → Feature เป็นเจ้าของ Business Capability
  → Shared เป็น Infrastructure ที่ไม่รู้จัก Feature
  → Zod ป้องกัน Runtime Boundary
  → Tests ตรวจจาก Contract ถึง Browser
```

เมื่อมี Requirement ใหม่ ให้เริ่มจากการหาเจ้าของ State และ Boundary ก่อนเลือก Library หรือสร้าง Folder ใหม่