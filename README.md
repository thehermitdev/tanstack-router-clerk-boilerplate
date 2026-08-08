# TanStack Router Boilerplate

Boilerplate สำหรับสร้าง React SPA ระดับ Production โดยใช้ Bun, React, TanStack Router,
TanStack Query, Axios, Zod, Tailwind CSS v4 และ shadcn/ui

Repository นี้ออกแบบเป็น **Architecture Baseline ที่ไม่ผูกกับผู้ให้บริการรายใดรายหนึ่ง**
เหมาะสำหรับทีมที่ต้องการโครงสร้าง Frontend ที่มี Type Safety, Runtime Validation,
Predictable Data Flow, Testability และขอบเขต Dependency ที่ชัดเจน แต่ยังต้องการเลือก
Authentication, Backend, Hosting, Form Library หรือ Global Store ให้เหมาะกับระบบของตนเอง

Boilerplate ไม่ติดตั้ง Authentication Provider มาให้ และไม่บังคับใช้ Clerk, Auth0, Keycloak,
OIDC Provider หรือระบบ Session แบบใดแบบหนึ่ง ทีมสามารถเพิ่ม Provider ผ่าน Adapter Boundary
ภายหลังได้โดยไม่ทำให้ Business Feature ผูกกับ SDK ของ Vendor

## ความสามารถหลัก

- File-based Routing ที่ตรวจสอบ Type ได้ด้วย TanStack Router
- Route-level Data Prefetching ผ่าน TanStack Query Query Options
- URL Search Parameters และ Path Parameters ที่ Validate ด้วย Zod
- TanStack Query เป็นเจ้าของ Server State และ Query Cache เพียงจุดเดียว
- Axios ถูกซ่อนไว้หลัง Shared HTTP Client
- Runtime Validation สำหรับ Environment, URL และ API Response
- โครงสร้างแบบ Feature-oriented พร้อม Dependency Direction ที่บังคับใช้ด้วย ESLint
- Feature Public API ผ่าน `index.ts` เพื่อลด Deep Import และ Coupling
- Tailwind CSS v4 และ shadcn/ui Primitives ที่ Repository เป็นเจ้าของ Source Code
- Light, Dark และ System Theme พร้อม Persist Preference
- GitHub Actions, Dependabot, Contribution Guide, Security Policy และ Agent Guidelines
- โมดูล `users` จาก DummyJSON สำหรับใช้เป็น Reference Implementation
- Tutorial ภาษาไทยสำหรับสร้างโมดูล `todos` ครบตั้งแต่ API Contract ถึง E2E

## แนวคิดสำคัญ: ไม่มี Vendor Lock-in

Boilerplate นี้กำหนดเฉพาะ Boundary และ Responsibility ที่จำเป็นสำหรับ React SPA แต่ไม่ตัดสินใจแทนทีมในส่วนที่ขึ้นกับบริบทธุรกิจ

### Authentication

ไม่มี Authentication SDK ติดตั้งมาให้ ทีมสามารถเลือกใช้ได้ตามข้อกำหนด เช่น

- Managed Identity Provider
- OAuth 2.0 หรือ OpenID Connect
- Enterprise SSO
- Self-hosted Identity Provider
- Backend Session และ HttpOnly Cookie
- Custom Authentication ขององค์กร

แนวทางที่แนะนำคือกำหนด Provider-neutral Contract ใน `src/shared/auth` แล้วสร้าง Adapter
ของ Provider จริงใน `src/app/providers` Business Feature และ Route จึงไม่ต้อง Import SDK ของ Vendor โดยตรง

### Backend และ API

Shared HTTP Client รับ Base URL จาก Environment และไม่ผูกกับ Backend Framework ทีมสามารถเชื่อมต่อ
REST API, BFF, API Gateway หรือบริการภายในองค์กรได้ โดยคง Runtime Contract Validation ไว้ที่ Feature Boundary

### Hosting

Repository ไม่เพิ่มไฟล์ตั้งค่าเฉพาะ Vercel, Netlify, Cloudflare หรือผู้ให้บริการรายใดรายหนึ่ง
สิ่งที่ Hosting ต้องรองรับคือการ Serve Static Assets และ Rewrite Unknown Path กลับไป `/index.html`
สำหรับ Client-side Routing

### UI และ Design System

shadcn/ui ถูกใช้ในรูปแบบ Source-owned Component ไม่ใช่ Runtime Component Package
ทีมสามารถแก้ Theme, Token, Primitive หรือย้ายไป Design System ภายในองค์กรได้โดยไม่รอ Vendor Release

### State Management

Boilerplate ใช้ TanStack Query สำหรับ Server State และ TanStack Router สำหรับ URL State
แต่ไม่ติดตั้ง Global Client Store มาให้ ควรเพิ่ม Store เมื่อมี Cross-page Client State ที่ URL,
Query Cache, Context หรือ Local State ไม่สามารถรับผิดชอบได้อย่างเหมาะสมเท่านั้น

### Form และ Local Database

ไม่มี Form Library หรือ Local Database ถูกบังคับเป็นค่าเริ่มต้น Feature สามารถเลือกเครื่องมือให้ตรงกับ
ความซับซ้อนของ Validation, Workflow, Offline และ Synchronization โดยไม่เปลี่ยนโครงสร้างหลักของระบบ

## Boilerplate นี้เหมาะกับใคร

เหมาะสำหรับ

- ทีมที่สร้าง Client-rendered React SPA เชื่อมต่อ HTTP API
- โปรเจ็กต์ที่ต้องการ File-based Routing และ Typed URL State
- ระบบที่ต้องการแยก Route, Feature, Transport และ Shared Infrastructure อย่างชัดเจน
- ทีมที่ต้องการ Automated Test และ CI Quality Gate ตั้งแต่เริ่มต้น
- องค์กรที่ต้องการเลือก Authentication และ Deployment Provider เอง
- โปรเจ็กต์ที่ต้องการ Reference Architecture แต่ไม่ต้องการ Full-stack Framework

ควรประเมินทางเลือกอื่นเมื่อระบบต้องการ

- SSR หรือ Streaming SSR
- Server Components
- Server Functions หรือ Full-stack Routing
- Edge Runtime ที่ผูกกับ Framework
- Offline-first Synchronization เป็นความสามารถหลักตั้งแต่เริ่มต้น

กรณีดังกล่าวควรพิจารณา TanStack Start หรือ Framework ที่รองรับ Server Runtime โดยตรง
แทนการยืด Client-only SPA เกินขอบเขตที่ออกแบบไว้

## เริ่มต้นใช้งาน

### 1. สร้าง Repository จาก Template

กด **Use this template** บน GitHub แล้วเลือก **Create a new repository**
จากนั้น Clone Repository ใหม่ลงเครื่อง

```bash
git clone https://github.com/YOUR_ACCOUNT/YOUR_APP.git
cd YOUR_APP
```

การสร้างจาก Template จะได้ Git History ใหม่ และไม่ผูกกับ Commit History ของ Boilerplate ต้นทาง

### 2. กำหนด Environment

คัดลอกไฟล์ตัวอย่าง

```bash
cp .env.example .env
```

กำหนดค่าของโปรเจ็กต์

```dotenv
VITE_APP_NAME=My Application
VITE_API_BASE_URL=https://api.example.com
VITE_API_TIMEOUT_MS=15000
```

Environment ถูก Validate ด้วย Zod ก่อน Application เริ่มทำงาน หากค่าไม่ถูกต้องระบบจะหยุดพร้อม Error
แทนการปล่อยให้ Runtime อยู่ในสถานะไม่แน่นอน

> ตัวแปร `VITE_*` ถูกฝังลงใน JavaScript ฝั่ง Browser และถือเป็นข้อมูลสาธารณะ ห้ามใส่ Password,
> Secret Key, Private Key, Database Credential, Privileged Token หรือข้อมูลลับของระบบ

### 3. ติดตั้ง Dependencies

```bash
bun install
```

Template ตั้งใจไม่ Commit `bun.lock` เพื่อให้ Repository ที่สร้างใหม่เป็นเจ้าของ Dependency Graph ของตนเอง
หลังติดตั้งครั้งแรกให้ตรวจ Lockfile แล้ว Commit เข้า Repository

```bash
git add package.json bun.lock

git commit -m "chore: initialize project dependencies"
```

หลังจากมี Lockfile แล้ว ควรเปลี่ยน CI และคำสั่งติดตั้งของทีมเป็น

```bash
bun install --frozen-lockfile
```

เพื่อให้ Local, CI, Staging และ Production ใช้ Dependency Graph ชุดเดียวกัน

### 4. ตรวจ Baseline

```bash
bun run routes:generate
bun run check
```

คำสั่งเหล่านี้ตรวจ Route Tree, Formatting, ESLint, Architecture Rules, TypeScript, และ Production Build 

### 5. เปิด Development Server

```bash
bun run dev
```

เปิด Browser ที่

```text
http://localhost:3000
```

หน้าแรกจะแสดง Onboarding Timeline สำหรับตั้งค่าชื่อโปรเจ็กต์, Environment, Lockfile,
Quality Gate, Architecture Review และ Pull Request แรก พร้อม Theme Selector สำหรับ Light, Dark และ System

## คำสั่งที่ใช้บ่อย

| คำสั่ง                    | หน้าที่                                     |
| ------------------------- | ------------------------------------------- |
| `bun run dev`             | เปิด Vite Development Server ที่พอร์ต 3000  |
| `bun run routes:generate` | สร้าง TanStack Route Tree                   |
| `bun run build`           | สร้าง Route Tree และ Production Build       |
| `bun run preview`         | Preview Production Build                    |
| `bun run typecheck`       | สร้าง Route Tree และตรวจ TypeScript         |
| `bun run lint`            | ตรวจ ESLint และ Architecture Rules          |
| `bun run lint:fix`        | แก้ ESLint ที่แก้อัตโนมัติได้               |
| `bun run format`          | จัดรูปแบบไฟล์ด้วย Prettier                  |
| `bun run format:check`    | ตรวจรูปแบบไฟล์โดยไม่แก้ไข                   |
| `bun run check`           | รัน Format, Lint, Typecheck, และ Build |

## โครงสร้าง Directory

```text
src/
├── app/        # Application composition, router และ query client
├── routes/     # URL ownership และ orchestration
├── features/   # Vertical business capabilities
├── shared/     # Reusable infrastructure, config, theme และ UI primitives
├── styles/     # Global styles และ typography
└── test/       # Cross-feature test infrastructure
```

Dependency Direction หลักคือ

```text
app → routes → features → shared
```

ความหมายของทิศทางนี้

- `app` ประกอบระบบและรู้จัก Layer ด้านในได้
- `routes` เชื่อม URL เข้ากับ Feature
- `features` ใช้ Shared Infrastructure และ Shared UI
- `shared` ต้องไม่รู้จัก Business Feature, Route หรือ Application Composition

อ่านรายละเอียดก่อนเพิ่ม Production Feature ที่
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

## Data Flow

Read Flow มาตรฐานของระบบคือ

```text
Browser URL
  → TanStack Router
  → Zod Search Validation
  → Route Loader
  → Feature Query Options
  → TanStack Query Cache
  → Feature API Client
  → Shared Axios Client
  → HTTP API
  → Zod Response Validation
  → Typed Feature Page
  → UI
```

Route Loader และ Component ใช้ Query Options ชุดเดียวกัน จึง Prefetch และ Consume Cache Entry เดียวกัน
โดยไม่เขียน Fetching Logic ซ้ำ

Mutation Flow มาตรฐานคือ

```text
User Action
  → Feature Mutation Options
  → Feature API Client
  → Shared Axios Client
  → HTTP API
  → Zod Response Validation
  → Cache Update หรือ Invalidation
  → UI Re-render
```

Cache Policy ต้องกำหนดตาม Consistency Model ของ API ไม่ควร Invalidate ทุก Query โดยไม่มีเหตุผล
และไม่ควรแก้ Query Cache แบบคาดเดาเมื่อ Server เป็นเจ้าของข้อมูลจริง

## State Ownership

| ประเภท State            | เจ้าของที่แนะนำ                           |
| ----------------------- | ----------------------------------------- |
| Server และ Remote State | TanStack Query                            |
| URL-addressable State   | TanStack Router Search/Path Parameters    |
| Form Draft              | Local State หรือ Form Library ของ Feature |
| Ephemeral Visual State  | React Local State                         |
| Theme Preference        | Theme Provider                            |
| Cross-page Client State | Global Store ที่มีเหตุผลรองรับชัดเจน      |

ไม่ควร Copy Query Data ไปเก็บใน Context หรือ Global Store เพราะจะสร้าง Source of Truth หลายชุด
และทำให้ Cache Invalidation, Refetch และ Error Recovery ซับซ้อนโดยไม่จำเป็น

## Reference Implementation

### Users Feature

Repository มีโมดูล `users` จาก DummyJSON เป็น Reference Feature ที่แสดง Pattern ต่อไปนี้

- Zod API Contract
- Shared Axios Transport
- Query Key Factory และ Query Options
- Route Search Validation
- Server Pagination ด้วย `limit` และ `skip`
- Route Loader Prefetch
- Suspense Query Consumption
- Pending, Error, Empty และ Success State
- MSW Integration Test
- Component Test และ Playwright E2E

ไฟล์หลักอยู่ที่

```text
src/features/users/
src/routes/users.tsx
```

ควรใช้ Users Feature เป็นมาตรฐานอ้างอิงจนกว่า Feature จริงตัวแรกของโปรเจ็กต์จะทำงานครบ Flow
จากนั้นจึงตัดสินใจว่าจะคงไว้เป็น Example หรือลบออก

### Todos Tutorial

[`docs/GETTING_STARTED.th.md`](docs/GETTING_STARTED.th.md) เป็น Step-by-step Tutorial ภาษาไทย
สำหรับสร้าง DummyJSON Todos Module โดยครอบคลุม

- List และ Detail
- Pagination และ Filter ตาม User
- Random Todo แบบ Command-shaped Read
- Add, Update และ Delete Mutation
- Query Key Normalization
- Cache Projection
- URL State Normalization

Tutorial เป็นเอกสารสอนสร้างโมดูล ตัว Boilerplate ยังไม่ได้เพิ่ม Todos Feature เข้า Production Source

## การเพิ่ม Feature ใหม่

โครงสร้างเริ่มต้นที่แนะนำ

```text
src/features/orders/
├── api/
│   ├── contracts.ts
│   ├── client.ts
│   ├── queries.ts
│   └── mutations.ts
├── components/
├── pages/
├── model/
└── index.ts
```

ลำดับการพัฒนา

1. กำหนด External Contract ด้วย Zod
2. เขียน API Client โดยใช้ `httpClient`
3. สร้าง Query Key และ Query Options
4. กำหนด Mutation และ Cache Policy
5. สร้าง Feature Components และ Pages
6. Export เฉพาะ Public API ผ่าน `index.ts`
7. เพิ่ม Route และ Validate URL Input
8. ให้ Route Loader Prefetch ผ่าน Query Options
9. เพิ่ม Loading, Error, Empty และ Success State
11. รัน `bun run check`

Route ควรทำหน้าที่เป็น Orchestration Layer เท่านั้น

```tsx
export const Route = createFileRoute('/orders')({
  validateSearch: (search) => ordersSearchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(ordersListQueryOptions(deps)),
  component: OrdersRoute,
})
```

Route ไม่ควร Import Axios, Parse API Response, Map Domain Data หรือเก็บ Business Calculation

## Authentication และ Authorization

Boilerplate ปัจจุบันเป็น Public SPA และยังไม่มี Authentication Runtime

เมื่อโปรเจ็กต์ต้องการ Authentication ไม่ควร Import Provider SDK กระจายเข้า Route และ Feature
ให้เพิ่ม Provider-neutral Boundary ตามแนวทางนี้

```text
src/
├── app/
│   └── providers/
│       └── authentication-provider.tsx
├── shared/
│   └── auth/
│       ├── auth-context.tsx
│       └── auth-session.ts
└── routes/
    └── protected-route.tsx
```

ตัวอย่าง Contract กลาง

```ts
interface AuthSession {
  isLoaded: boolean
  isAuthenticated: boolean
  userId: string | null
  getAccessToken: () => Promise<string | null>
  signIn: (redirectTo?: string) => void
  signOut: () => Promise<void>
}
```

Adapter ภายใน `src/app/providers` เป็นจุดที่ Import SDK ของ Provider จริง แล้วแปลง State และ Command
ให้ตรงกับ Contract กลาง Feature จึงไม่ต้องรู้ว่า Session มาจาก Managed Provider, OIDC,
Backend Cookie หรือระบบ Identity ภายในองค์กร

เมื่อ API ต้องใช้ Access Token ให้จัดการผ่าน Shared HTTP Boundary โดยต้องมี Lifecycle ที่ชัดเจนสำหรับ
Token Refresh, Logout, Request Cancellation และ Error Normalization

> Route Guard ฝั่ง Browser มีหน้าที่ควบคุม Navigation และ User Experience เท่านั้น
> Backend ต้องตรวจ Authentication Token หรือ Session และตรวจ Authorization ทุก Request
> ก่อนคืนข้อมูลที่มีสิทธิ์เข้าถึงจำกัด

## Environment และ Security

Environment Schema อยู่ที่

```text
src/shared/config/env.ts
```

เมื่อเพิ่ม Environment Variable ใหม่ ต้องอัปเดตทั้ง

- `.env.example`
- Zod Environment Schema
- Deployment Environment
- CI Environment เมื่อ Test หรือ Build ต้องใช้ค่าใหม่

ข้อกำหนดด้าน Security

- ห้าม Commit Credential, Access Token หรือข้อมูลลูกค้าจริง
- ห้ามใส่ Secret ในตัวแปร `VITE_*`
- API ฝั่ง Server ต้อง Validate Input และ Permission ซ้ำเสมอ
- Frontend Validation มีไว้เพื่อ Type Safety และ User Experience ไม่ใช่ Security Boundary
- Error UI ไม่ควรแสดง Stack Trace, Token หรือ Sensitive Payload
- Observability ต้อง Redact Personal Data และ Secret ก่อนส่งออกนอกระบบ

อ่านนโยบายเพิ่มเติมที่ [`SECURITY.md`](SECURITY.md)

## UI, Theme และ shadcn/ui

Shared UI Primitives อยู่ที่

```text
src/shared/ui/
```

`components.json` กำหนด Alias ให้ shadcn CLI สร้าง Component ใน Shared UI Layer
Component ที่ Generate แล้วถือเป็น Source Code ของ Repository ทีมต้อง Review, Test และดูแลเอง

กฎสำคัญ

- Primitive เช่น Button, Card, Dialog และ Input ต้องไม่มี Business Logic
- Component ที่รู้จัก Order, Patient, Invoice หรือ Domain อื่นต้องอยู่ใน Feature
- ใช้ `class-variance-authority` สำหรับ Variant API ที่มีโครงสร้าง
- ใช้ `cn()` รวม Class และแก้ Tailwind Conflict
- Light, Dark และ System Theme จัดการผ่าน Theme Provider
- Accessibility Behavior ควรใช้ Primitive ที่ผ่านการออกแบบมา เช่น Radix UI

## Testing Strategy

### Unit Test

ใช้ Vitest สำหรับ Pure Function, Schema, Mapper, Query Key และ Business Rule ที่ไม่ต้อง Render UI

### Component Test

ใช้ Testing Library เพื่อทดสอบ Behavior ที่ผู้ใช้มองเห็น ไม่ผูก Test กับ Internal Implementation

### API Integration Test

ใช้ MSW Intercept Network Request ที่ Boundary จริง ช่วยทดสอบ Axios, Zod Contract,
Error Normalization และ Query Integration โดยไม่เรียก API ภายนอก

Test ควร Deterministic และไม่พึ่ง Production Account, Production Credential หรือ Network ภายนอก

## Quality Gate และ CI

`bun run check` รัน

```text
Prettier
  → ESLint และ Architecture Rules
  → TypeScript Strict Typecheck
  → Vitest
  → TanStack Route Generation
  → Vite Production Build
```


Pull Request พร้อม Merge เมื่อ

- Scope มีขนาดเล็กและชัดเจน
- Architecture Boundary ไม่ถูกละเมิด
- External Data ผ่าน Runtime Validation
- Async Page มี Loading, Error, Empty และ Success State
- เอกสารถูกอัปเดตเมื่อ Convention เปลี่ยน
- Quality และ E2E ผ่าน

## การ Deploy

สร้าง Production Build

```bash
bun run build
```

Output อยู่ใน

```text
dist/
```

Hosting ต้อง Rewrite URL ที่ไม่ตรงกับ Static File กลับไป `/index.html`
เพื่อให้ Direct Navigation เช่น `/users?page=2&pageSize=10` ไม่คืน 404

ก่อน Deploy Production ควรกำหนด

- API CORS Policy
- Content Security Policy
- Static Asset Cache Headers
- HTML Cache Policy
- Source Map Policy
- Environment Separation
- Error Monitoring และ Log Redaction
- Deployment Approval และ Rollback Strategy

Repository ไม่ Commit Configuration ของ Hosting Provider เพื่อรักษาความเป็น Provider-neutral
โปรเจ็กต์ที่สร้างจาก Template ควรเพิ่มไฟล์ Deployment เฉพาะ Provider ของตนเองภายหลัง

## กฎหลักของสถาปัตยกรรม

1. Component และ Route ห้าม Import Axios โดยตรง
2. TanStack Query เป็นเจ้าของ Server State
3. TanStack Router เป็นเจ้าของ URL-addressable State
4. Route Loader Prefetch ผ่าน Query Options และไม่เขียน Fetching Logic ซ้ำ
5. ข้อมูลจาก API, URL, Environment, Storage และ Message ต้องถูก Validate ที่ Boundary
6. `src/shared` ห้าม Import จาก `src/app`, `src/routes` หรือ `src/features`
7. Feature เปิดเผย Public API ผ่าน `index.ts`
8. Shared UI Primitive ต้องไม่มี Business Logic
9. Async Page ต้องมี Loading, Error, Empty และ Success State
10. Request ที่ยกเลิกได้ต้องส่ง `AbortSignal` ถึง Transport
11. `src/routeTree.gen.ts` เป็น Generated File ห้ามแก้หรือ Commit ด้วยมือ
12. การเพิ่ม Dependency ใหม่ต้องมีปัญหาที่ชัดเจนและบันทึก Trade-off ที่สำคัญ

กฎสำหรับ Coding Agent อยู่ที่ [`AGENTS.md`](AGENTS.md)

## TanStack DB

TanStack DB ไม่ได้ติดตั้งเป็นค่าเริ่มต้น เพราะ CRUD ผ่าน REST API ทั่วไปสามารถใช้ TanStack Query
ได้ง่ายกว่าและมี Mental Model ที่เล็กกว่า

ควรพิจารณา TanStack DB เมื่อระบบต้องการ

- Normalized Entity Collections หลายหน้าจอ
- Reactive Join, Filter หรือ Aggregation บน Local Collection
- Optimistic Local Writes เป็น Core Experience
- Offline Operation
- Synchronization Engine
- Conflict Resolution และ Persistence Model

ไม่ควรเพิ่มเพียงเพราะเป็นส่วนหนึ่งของ TanStack Ecosystem

อ่านแนวทางที่ [`docs/recipes/tanstack-db.md`](docs/recipes/tanstack-db.md)

## เอกสาร

- [Architecture Guide](docs/ARCHITECTURE.md)
- [Step-by-step Todos Tutorial](docs/GETTING_STARTED.th.md)
- [TanStack DB Adoption Recipe](docs/recipes/tanstack-db.md)
- [Contribution Guide](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [Engineering Rules for Agents](AGENTS.md)

## License

เผยแพร่ภายใต้ [MIT License](LICENSE)