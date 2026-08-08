# คู่มือสร้างโมดูล Todos แบบครบ Flow

เอกสารนี้เป็น Step-by-step Tutorial สำหรับผู้ใช้ Boilerplate โดยใช้ DummyJSON Todos เป็นตัวอย่าง เป้าหมายคือสร้างโมดูลที่ UI เรียบง่าย แต่รักษาสถาปัตยกรรมระดับ Production ตั้งแต่ URL, API Contract, Query Cache, Mutation, UI, Test และ Navigation

เมื่อทำครบจะได้ Flow ต่อไปนี้

```text
/todos
  → List + Pagination
  → Filter ตาม User ID
  → สุ่ม Todo 1–10 รายการ
  → เพิ่ม Todo แบบจำลอง
  → /todos/$todoId
      → Detail
      → Update แบบจำลอง
      → Delete แบบจำลอง
```

> DummyJSON จำลอง `POST`, `PUT/PATCH` และ `DELETE` เท่านั้น ข้อมูล Mutation จะไม่ถูกบันทึกถาวร เมื่อ Refresh หรือ Fetch ใหม่ Dataset จะกลับเป็นข้อมูลเดิม

## 1. API ที่ Tutorial นี้ครอบคลุม

| ความสามารถ            | Method      | Endpoint                    | จุดที่นำไปใช้                 |
| --------------------- | ----------- | --------------------------- | ----------------------------- |
| รายการ Todos          | `GET`       | `/todos`                    | List Page                     |
| Todo รายการเดียว      | `GET`       | `/todos/:id`                | Detail Page                   |
| สุ่ม Todo หนึ่งรายการ | `GET`       | `/todos/random`             | Random Panel                  |
| สุ่ม Todo หลายรายการ  | `GET`       | `/todos/random/:count`      | Random Panel สูงสุด 10 รายการ |
| Limit และ Skip        | `GET`       | `/todos?limit=...&skip=...` | Server Pagination             |
| Todos ตาม User        | `GET`       | `/todos/user/:userId`       | User Scope                    |
| เพิ่ม Todo            | `POST`      | `/todos/add`                | Create Form                   |
| แก้ไข Todo            | `PUT/PATCH` | `/todos/:id`                | Edit Form                     |
| ลบ Todo               | `DELETE`    | `/todos/:id`                | Delete Action                 |

Tutorial ใช้ `PATCH` สำหรับ Update เพราะ Form ส่งเฉพาะ Field ที่เปลี่ยน หากระบบจริงต้อง Replace Resource ทั้งก้อนจึงใช้ `PUT`

## 2. เตรียมโปรเจ็กต์

Clone Repository ที่สร้างจาก Template แล้วสร้าง Branch

```bash
git switch -c feat/dummyjson-todos
```

คัดลอก Environment

```bash
cp .env.example .env
```

กำหนดค่า

```dotenv
VITE_APP_NAME=TanStack Router Boilerplate
VITE_API_BASE_URL=https://dummyjson.com
VITE_API_TIMEOUT_MS=15000
```

ติดตั้งและตรวจ Baseline

```bash
bun install
bun run routes:generate
bun run check
bun run test:e2e
bun run dev
```

เปิด

```text
http://localhost:3000
```

> Repository Template ปัจจุบันไม่บังคับ `bun.lock` หลังสร้างโปรเจ็กต์จริงควรตรวจและ Commit Lockfile แล้วเปลี่ยน CI เป็น `bun install --frozen-lockfile`

## 3. โครงสร้างไฟล์สุดท้าย

```text
src/
├── features/
│   └── todos/
│       ├── api/
│       │   ├── client.test.ts
│       │   ├── client.ts
│       │   ├── contracts.ts
│       │   ├── mutations.ts
│       │   └── queries.ts
│       ├── components/
│       │   ├── random-todos-panel.tsx
│       │   ├── todo-mutation-panel.tsx
│       │   ├── todos-table.test.tsx
│       │   ├── todos-table.tsx
│       │   └── todos-toolbar.tsx
│       ├── pages/
│       │   ├── todo-detail-page.tsx
│       │   └── todos-page.tsx
│       └── index.ts
├── routes/
│   └── todos/
│       ├── $todoId.tsx
│       └── index.tsx
└── test/
    └── msw/
        └── handlers.ts
```

Ownership ของแต่ละส่วน

```text
routes/todos/*
  → URL, Search, Params, Loader และ Error Boundary

features/todos/api
  → Runtime Contract, HTTP Functions, Query และ Mutation

features/todos/components
  → Feature Interaction และ Presentation

features/todos/pages
  → ประกอบหน้าจอของ Feature

shared/api/http-client
  → Axios Transport กลาง
```

## 4. สร้าง API Contract

สร้าง `src/features/todos/api/contracts.ts`

```ts
import { z } from "zod";

export const todoSchema = z.object({
  id: z.coerce.number().int().positive(),
  todo: z.string().trim().min(1),
  completed: z.boolean(),
  userId: z.coerce.number().int().positive(),
});

export const todosListResponseSchema = z.object({
  todos: z.array(todoSchema),
  total: z.coerce.number().int().nonnegative(),
  skip: z.coerce.number().int().nonnegative(),
  limit: z.coerce.number().int().nonnegative(),
});

export const randomTodosSchema = z.array(todoSchema).min(1).max(10);

export const createTodoInputSchema = z.object({
  todo: z.string().trim().min(3).max(300),
  completed: z.boolean(),
  userId: z.number().int().positive(),
});

export const updateTodoInputSchema = createTodoInputSchema
  .pick({ todo: true, completed: true })
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "ต้องมีข้อมูลอย่างน้อยหนึ่ง Field สำหรับการแก้ไข",
  });

export const deletedTodoSchema = todoSchema.extend({
  isDeleted: z.literal(true),
  deletedOn: z.iso.datetime(),
});

export const randomTodoCountSchema = z.number().int().min(1).max(10);

export type CreateTodoInput = z.infer<typeof createTodoInputSchema>;
export type DeletedTodo = z.infer<typeof deletedTodoSchema>;
export type Todo = z.infer<typeof todoSchema>;
export type TodosListResponse = z.infer<typeof todosListResponseSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoInputSchema>;

```

เหตุผลที่ใช้ `z.coerce.number()` กับ Response

- API ภายนอกอาจส่ง Numeric Field เป็น String ในบาง Endpoint หรือบาง Version
- Contract Normalize ค่าให้เป็น `number` ก่อนเข้าสู่ Query Cache
- UI และ Query Key ไม่ต้องรองรับ `number | string`

กฎที่ต้องรักษา

- Type ทุกตัว Infer จาก Schema
- API Response ต้อง Parse ก่อนคืนออกจาก Client
- Mutation Input แยกจาก Response Contract
- `limit` ใช้ `nonnegative()` เพราะ DummyJSON รองรับ `limit=0`

อ่านรายละเอียดเพิ่มเติม:
- [การสร้าง API Contract](./details/todos/api-contract.md)
- [การเขียน Test สำหรับ API Contract](./details/todos/api-contract-test.md)

## 5. สร้าง API Client ให้ครบทุก Endpoint

สร้าง `src/features/todos/api/client.ts`

```ts
import { z } from "zod";

import {
  createTodoInputSchema,
  deletedTodoSchema,
  randomTodoCountSchema,
  randomTodosSchema,
  todoSchema,
  todosListResponseSchema,
  updateTodoInputSchema,
} from "./contracts";
import type {
  CreateTodoInput,
  DeletedTodo,
  Todo,
  TodosListResponse,
  UpdateTodoInput,
} from "./contracts";
import { httpClient } from "#/shared/api/http-client";
import { ApplicationError } from "#/shared/errors/application-error";

interface RequestInput {
  signal?: AbortSignal | undefined;
}

export interface GetTodosInput extends RequestInput {
  page: number;
  pageSize: number;
}

export interface GetTodoInput extends RequestInput {
  todoId: number;
}

export interface GetTodosByUserInput extends RequestInput {
  userId: number;
}

export interface GetRandomTodosInput extends RequestInput {
  count: number;
}

export interface AddTodoRequest extends RequestInput {
  input: CreateTodoInput;
}

export interface UpdateTodoRequest extends RequestInput {
  todoId: number;
  input: UpdateTodoInput;
}

export interface DeleteTodoRequest extends RequestInput {
  todoId: number;
}

function parseResponse<TSchema extends z.ZodType>(
  schema: TSchema,
  data: unknown,
  message: string,
): z.infer<TSchema> {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApplicationError(message, {
        code: "API_CONTRACT_ERROR",
        details: z.flattenError(error),
        cause: error.cause,
      });
    }

    throw error;
  }
}

function withSignal(signal: AbortSignal | undefined) {
  return signal === undefined ? {} : { signal };
}

export async function getTodos({
  page,
  pageSize,
  signal,
}: GetTodosInput): Promise<TodosListResponse> {
  const response = await httpClient.get("/todos", {
    params: {
      limit: pageSize,
      skip: (page - 1) * pageSize,
    },
    ...withSignal(signal),
  });

  return parseResponse(
    todosListResponseSchema,
    response.data,
    "Todos API ส่ง Response รายการไม่ตรง Contract",
  );
}

export async function getTodo({ todoId, signal }: GetTodoInput): Promise<Todo> {
  const response = await httpClient.get(`/todos/${todoId}`, withSignal(signal));

  return parseResponse(todoSchema, response.data, "Todos API ส่ง Todo ไม่ตรง Contract");
}

export async function getTodosByUser({
  userId,
  signal,
}: GetTodosByUserInput): Promise<TodosListResponse> {
  const response = await httpClient.get(`/todos/user/${userId}`, withSignal(signal));

  return parseResponse(
    todosListResponseSchema,
    response.data,
    "Todos By User API ส่ง Response ไม่ตรง Contract",
  );
}

export async function getRandomTodo({ signal }: RequestInput = {}): Promise<Todo> {
  const response = await httpClient.get("/todos/random", withSignal(signal));

  return parseResponse(todoSchema, response.data, "Random Todo API ส่ง Response ไม่ตรง Contract");
}

export async function getRandomTodos({ count, signal }: GetRandomTodosInput): Promise<Array<Todo>> {
  const parsedCount = randomTodoCountSchema.parse(count);

  if (parsedCount === 1) {
    return [await getRandomTodo({ signal })];
  }

  const response = await httpClient.get(`/todos/random/${parsedCount}`, withSignal(signal));

  return parseResponse(
    randomTodosSchema,
    response.data,
    "Random Todos API ส่ง Response ไม่ตรง Contract",
  );
}

export async function addTodo({ input, signal }: AddTodoRequest): Promise<Todo> {
  const payload = createTodoInputSchema.parse(input);
  const response = await httpClient.post("/todos/add", payload, withSignal(signal));

  return parseResponse(todoSchema, response.data, "Add Todo API ส่ง Response ไม่ตรง Contract");
}

export async function updateTodo({ todoId, input, signal }: UpdateTodoRequest): Promise<Todo> {
  const payload = updateTodoInputSchema.parse(input);
  const response = await httpClient.patch(`/todos/${todoId}`, payload, withSignal(signal));

  return parseResponse(todoSchema, response.data, "Update Todo API ส่ง Response ไม่ตรง Contract");
}

export async function deleteTodo({ todoId, signal }: DeleteTodoRequest): Promise<DeletedTodo> {
  const response = await httpClient.delete(`/todos/${todoId}`, withSignal(signal));

  return parseResponse(
    deletedTodoSchema,
    response.data,
    "Delete Todo API ส่ง Response ไม่ตรง Contract",
  );
}
```

จุดสำคัญ

- ทุก Read Query ส่ง `AbortSignal` ถึง Axios
- `getRandomTodos({ count: 1 })` เรียก `/todos/random`
- `getRandomTodos({ count: 2–10 })` เรียก `/todos/random/:count`
- Create และ Update Validate Request Input ก่อนส่ง
- Client คืน Domain Data ไม่คืน `AxiosResponse`
- `PATCH` ส่งเฉพาะ Field ที่ Form แก้ไข

อ่านรายละเอียดเพิ่มเติม:
- [การสร้าง API Client](./details/todos/api-client.md)
- [การเขียน Test สำหรับ API Client](./details/todos/api-client-test.md)


## 6. สร้าง Query Key และ Query Options

สร้าง `src/features/todos/api/queries.ts`

```ts
import { queryOptions } from "@tanstack/react-query";

import { getTodo, getTodos, getTodosByUser } from "./client";

export type TodosListSource = "all" | "user";

export interface TodosListQueryInput {
  page: number;
  pageSize: number;
  source: TodosListSource;
  userId: number | null;
}

function normalizeTodosListInput(input: TodosListQueryInput) {
  if (input.source === "user") {
    return {
      source: input.source,
      userId: input.userId,
    } as const;
  }

  return {
    source: input.source,
    page: input.page,
    pageSize: input.pageSize,
  } as const;
}

export const todosKeys = {
  all: ["todos"] as const,
  lists: () => [...todosKeys.all, "list"] as const,
  list: (input: TodosListQueryInput) =>
    [...todosKeys.lists(), normalizeTodosListInput(input)] as const,
  details: () => [...todosKeys.all, "detail"] as const,
  detail: (todoId: number) => [...todosKeys.details(), todoId] as const,
};

export function todosListQueryOptions(input: TodosListQueryInput) {
  return queryOptions({
    queryKey: todosKeys.list(input),
    queryFn: ({ signal }) => {
      if (input.source === "user") {
        if (input.userId === null) {
          throw new Error("User Scope ต้องมี userId");
        }

        return getTodosByUser({ userId: input.userId, signal });
      }

      return getTodos({
        page: input.page,
        pageSize: input.pageSize,
        signal,
      });
    },
    staleTime: 60_000,
  });
}

export function todoDetailQueryOptions(todoId: number) {
  return queryOptions({
    queryKey: todosKeys.detail(todoId),
    queryFn: ({ signal }) => getTodo({ todoId, signal }),
    staleTime: 60_000,
  });
}
```

### ทำไมต้อง Normalize Query Key

ใน `source=user` API ไม่ใช้ `page` และ `pageSize` หาก Query Key เก็บค่าที่ไม่เกี่ยวข้องจะเกิด Cache หลายชุดสำหรับ Request เดียวกัน

```text
ไม่ Normalize
['todos', 'list', { source: 'user', userId: 5, page: 1 }]
['todos', 'list', { source: 'user', userId: 5, page: 2 }]
```

ทั้งสอง Key เรียก Endpoint เดียวกัน

หลัง Normalize

```text
['todos', 'list', { source: 'user', userId: 5 }]
```

Query Key จึงสะท้อน HTTP Resource จริง

อ่านรายละเอียดเพิ่มเติม:
- [การสร้าง API Queries](./details/todos/api-queries.md)
- [การเขียน Test สำหรับ API Queries](./details/todos/api-queries-test.md)

## 7. สร้าง Mutation และ Cache Policy

สร้าง `src/features/todos/api/mutations.ts`

```ts
import { mutationOptions } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";

import { addTodo, deleteTodo, getRandomTodos, updateTodo } from "./client";
import type { CreateTodoInput, Todo, TodosListResponse, UpdateTodoInput } from "./contracts";
import { todosKeys } from "./queries";
import type { TodosListQueryInput } from "./queries";

export const todosMutationKeys = {
  all: ["todos", "mutation"] as const,
  random: () => [...todosMutationKeys.all, "random"] as const,
  add: () => [...todosMutationKeys.all, "add"] as const,
  update: (todoId: number) => [...todosMutationKeys.all, "update", todoId] as const,
  delete: (todoId: number) => [...todosMutationKeys.all, "delete", todoId] as const,
};

function shouldInsertIntoActiveList(input: TodosListQueryInput, todo: Todo) {
  if (input.source === "user") {
    return input.userId === todo.userId;
  }

  return input.page === 1;
}

function prependTodo(current: TodosListResponse, todo: Todo): TodosListResponse {
  if (current.todos.some((item) => item.id === todo.id)) {
    return current;
  }

  const nextTodos = [todo, ...current.todos];
  const visibleTodos = current.limit > 0 ? nextTodos.slice(0, current.limit) : nextTodos;

  return {
    ...current,
    todos: visibleTodos,
    total: current.total + 1,
  };
}

export function randomTodosMutationOptions() {
  return mutationOptions({
    mutationKey: todosMutationKeys.random(),
    mutationFn: (count: number) => getRandomTodos({ count }),
  });
}

export function addTodoMutationOptions(
  queryClient: QueryClient,
  activeListInput: TodosListQueryInput,
) {
  return mutationOptions({
    mutationKey: todosMutationKeys.add(),
    mutationFn: (input: CreateTodoInput) => addTodo({ input }),
    onSuccess: (createdTodo) => {
      queryClient.setQueryData(todosKeys.detail(createdTodo.id), createdTodo);

      if (!shouldInsertIntoActiveList(activeListInput, createdTodo)) {
        return;
      }

      queryClient.setQueryData<TodosListResponse>(todosKeys.list(activeListInput), (current) =>
        current ? prependTodo(current, createdTodo) : current,
      );
    },
  });
}

export function updateTodoMutationOptions(queryClient: QueryClient, todoId: number) {
  return mutationOptions({
    mutationKey: todosMutationKeys.update(todoId),
    mutationFn: (input: UpdateTodoInput) => updateTodo({ todoId, input }),
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData(todosKeys.detail(todoId), updatedTodo);

      queryClient.setQueriesData<TodosListResponse>({ queryKey: todosKeys.lists() }, (current) => {
        if (!current) {
          return current;
        }

        const containsTodo = current.todos.some((todo) => todo.id === todoId);

        if (!containsTodo) {
          return current;
        }

        return {
          ...current,
          todos: current.todos.map((todo) => (todo.id === todoId ? updatedTodo : todo)),
        };
      });
    },
  });
}

export function deleteTodoMutationOptions(queryClient: QueryClient, todoId: number) {
  return mutationOptions({
    mutationKey: todosMutationKeys.delete(todoId),
    mutationFn: () => deleteTodo({ todoId }),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: todosKeys.detail(todoId) });

      queryClient.setQueriesData<TodosListResponse>({ queryKey: todosKeys.lists() }, (current) => {
        if (!current) {
          return current;
        }

        const containsTodo = current.todos.some((todo) => todo.id === todoId);

        if (!containsTodo) {
          return current;
        }

        return {
          ...current,
          todos: current.todos.filter((todo) => todo.id !== todoId),
          total: Math.max(0, current.total - 1),
        };
      });
    },
  });
}
```

### ทำไม Random GET ใช้ Mutation

`/todos/random` เป็น HTTP GET แต่พฤติกรรมใน UI เป็น Command

```text
ผู้ใช้กดปุ่ม
  → ต้องการผลลัพธ์ใหม่ทุกครั้ง
  → ไม่ต้องการ Cache ตาม Key เดิม
  → ไม่ต้องการ Background Refetch
```

ดังนั้น `useMutation` เหมาะกว่า `useQuery` แม้ HTTP Method จะเป็น GET การเลือก Query หรือ Mutation ควรดู Semantics ของ State และ Interaction ไม่ใช่ดู Method เพียงอย่างเดียว

### Cache Policy ของ DummyJSON

- Add: ใส่ผลลัพธ์ใน Active List Cache เฉพาะหน้าที่สมเหตุสมผล
- Update: แทนที่ Todo ใน Detail และ List Cache ทุกชุดที่มีรายการนั้น
- Delete: ลบ Detail Cache และลบออกจาก List Cache ทุกชุด
- Random: ไม่เก็บใน Query Cache

การ Update Cache นี้มีผลเฉพาะ Browser Session เพราะ DummyJSON ไม่ Persist Mutation

อ่านรายละเอียดเพิ่มเติม:
- [การสร้าง API Mutations](./details/todos/api-mutations.md)
- [การเขียน Test สำหรับ API Mutations](./details/todos/api-mutations-test.md)

## 8. สร้าง Todos Toolbar

สร้าง `src/features/todos/components/todos-toolbar.tsx`

```tsx
import type { TodosListQueryInput, TodosListSource } from "../api/queries";
import { Button } from "#/shared/ui/button";

interface TodosToolbarProps {
  search: TodosListQueryInput;
  onChange: (next: Partial<TodosListQueryInput>) => void;
  onReset: () => void;
}

const inputClassName =
  "h-9 rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring";

export function TodosToolbar({ search, onChange, onReset }: TodosToolbarProps) {
  return (
    <div className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">แหล่งข้อมูล</span>
        <select
          className={inputClassName}
          value={search.source}
          onChange={(event) => {
            const source = event.target.value as TodosListSource;

            onChange({
              source,
              page: 1,
              userId: source === "user" ? (search.userId ?? 1) : null,
            });
          }}
        >
          <option value="all">Todos ทั้งหมด</option>
          <option value="user">Todos ตาม User</option>
        </select>
      </label>

      {search.source === "user" ? (
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">User ID</span>
          <input
            className={inputClassName}
            type="number"
            min={1}
            value={search.userId ?? 1}
            onChange={(event) =>
              onChange({
                userId: Number(event.target.value),
                page: 1,
              })
            }
          />
        </label>
      ) : (
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">จำนวนต่อหน้า</span>
          <select
            className={inputClassName}
            value={search.pageSize}
            onChange={(event) =>
              onChange({
                pageSize: Number(event.target.value),
                page: 1,
              })
            }
          >
            {[5, 10, 20, 30, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="flex items-end">
        <Button variant="outline" onClick={onReset}>
          ล้างตัวกรอง
        </Button>
      </div>
    </div>
  );
}
```

กฎสำคัญ

- เปลี่ยน Source ต้อง Reset Page เป็น 1
- User Scope ต้องมี User ID
- Page Size ใช้เฉพาะ All Scope
- Component แจ้ง Intent ผ่าน Callback ไม่เรียก Router โดยตรง

## 9. สร้าง Todos Table

สร้าง `src/features/todos/components/todos-table.tsx`

```tsx
import { Link } from "@tanstack/react-router";

import type { Todo } from "../api/contracts";

interface TodosTableProps {
  todos: Array<Todo>;
}

export function TodosTable({ todos }: TodosTableProps) {
  if (todos.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        ไม่พบ Todo ตามเงื่อนไขที่เลือก
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Todo</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
              <th className="px-4 py-3 font-medium">ผู้ใช้งาน</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {todos.map((todo) => (
              <tr key={todo.id} className="bg-card">
                <td className="px-4 py-3">
                  <Link
                    to="/todos/$todoId"
                    params={{ todoId: String(todo.id) }}
                    className="font-medium hover:underline"
                  >
                    {todo.todo}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      todo.completed
                        ? "rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-700 dark:text-emerald-300"
                        : "rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-700 dark:text-amber-300"
                    }
                  >
                    {todo.completed ? "เสร็จแล้ว" : "ยังไม่เสร็จ"}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">User #{todo.userId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

Table รับ Typed Data และไม่รู้จัก Axios, Query Client หรือ Route Loader

## 10. สร้าง Random Todos Panel

สร้าง `src/features/todos/components/random-todos-panel.tsx`

```tsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { randomTodosMutationOptions } from "../api/mutations";
import { Button } from "#/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/shared/ui/card";

const selectClassName =
  "h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function RandomTodosPanel() {
  const [count, setCount] = useState(1);
  const mutation = useMutation(randomTodosMutationOptions());

  return (
    <Card>
      <CardHeader>
        <CardTitle>สุ่ม Todos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-2">
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">จำนวน</span>
            <select
              className={selectClassName}
              value={count}
              onChange={(event) => setCount(Number(event.target.value))}
            >
              {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <Button disabled={mutation.isPending} onClick={() => mutation.mutate(count)}>
            {mutation.isPending ? "กำลังสุ่ม…" : "สุ่มใหม่"}
          </Button>
        </div>

        {mutation.isError ? (
          <p className="text-sm text-destructive">{mutation.error.message}</p>
        ) : null}

        {mutation.data ? (
          <ul className="space-y-2">
            {mutation.data.map((todo) => (
              <li key={todo.id} className="rounded-lg border p-3 text-sm">
                <p className="font-medium">{todo.todo}</p>
                <p className="mt-1 text-muted-foreground">
                  #{todo.id} · User #{todo.userId} · {todo.completed ? "เสร็จแล้ว" : "ยังไม่เสร็จ"}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}
```

Panel นี้ไม่ใช้ Query Cache เพราะทุก Click ต้องสร้างผลลัพธ์ใหม่

## 11. สร้าง Create/Update/Delete Panel

สร้าง `src/features/todos/components/todo-mutation-panel.tsx`

```tsx
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addTodoMutationOptions,
  deleteTodoMutationOptions,
  updateTodoMutationOptions,
} from "../api/mutations";
import type { Todo } from "../api/contracts";
import type { TodosListQueryInput } from "../api/queries";
import { Button } from "#/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/shared/ui/card";

interface AddTodoPanelProps {
  activeListInput: TodosListQueryInput;
}

interface EditTodoPanelProps {
  todo: Todo;
  onDeleted: () => void;
}

const fieldClassName =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function AddTodoPanel({ activeListInput }: AddTodoPanelProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation(addTodoMutationOptions(queryClient, activeListInput));
  const [todo, setTodo] = useState("");
  const [completed, setCompleted] = useState(false);
  const [userId, setUserId] = useState(activeListInput.userId ?? 1);
  const [message, setMessage] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>เพิ่ม Todo</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            setMessage("");

            mutation.mutate(
              { todo, completed, userId },
              {
                onSuccess: (createdTodo) => {
                  setMessage(`DummyJSON จำลองการสร้าง Todo #${createdTodo.id} สำเร็จ`);
                  setTodo("");
                  setCompleted(false);
                },
                onError: (error) => setMessage(error.message),
              },
            );
          }}
        >
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">รายละเอียด</span>
            <input
              className={fieldClassName}
              required
              minLength={3}
              maxLength={300}
              value={todo}
              onChange={(event) => setTodo(event.target.value)}
            />
          </label>

          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">User ID</span>
            <input
              className={fieldClassName}
              type="number"
              min={1}
              required
              value={userId}
              onChange={(event) => setUserId(Number(event.target.value))}
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={completed}
              onChange={(event) => setCompleted(event.target.checked)}
            />
            สร้างเป็นรายการที่เสร็จแล้ว
          </label>

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "กำลังเพิ่ม…" : "เพิ่ม Todo"}
          </Button>

          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        </form>
      </CardContent>
    </Card>
  );
}

export function EditTodoPanel({ todo, onDeleted }: EditTodoPanelProps) {
  const queryClient = useQueryClient();
  const updateMutation = useMutation(updateTodoMutationOptions(queryClient, todo.id));
  const deleteMutation = useMutation(deleteTodoMutationOptions(queryClient, todo.id));
  const [text, setText] = useState(todo.todo);
  const [completed, setCompleted] = useState(todo.completed);
  const [message, setMessage] = useState("");

  const isPending = updateMutation.isPending || deleteMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>แก้ไขหรือลบ Todo</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            setMessage("");

            updateMutation.mutate(
              { todo: text, completed },
              {
                onSuccess: () => setMessage("DummyJSON จำลองการแก้ไขสำเร็จ"),
                onError: (error) => setMessage(error.message),
              },
            );
          }}
        >
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">รายละเอียด</span>
            <input
              className={fieldClassName}
              required
              minLength={3}
              maxLength={300}
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={completed}
              onChange={(event) => setCompleted(event.target.checked)}
            />
            เสร็จแล้ว
          </label>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={isPending}>
              {updateMutation.isPending ? "กำลังบันทึก…" : "บันทึกการแก้ไข"}
            </Button>

            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={() => {
                const confirmed = window.confirm(`ยืนยันการลบ Todo #${todo.id}`);

                if (!confirmed) {
                  return;
                }

                setMessage("");
                deleteMutation.mutate(undefined, {
                  onSuccess: onDeleted,
                  onError: (error) => setMessage(error.message),
                });
              }}
            >
              {deleteMutation.isPending ? "กำลังลบ…" : "ลบ Todo"}
            </Button>
          </div>

          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
        </form>
      </CardContent>
    </Card>
  );
}
```

Create และ Edit แยก Component เพื่อให้ Hook แต่ละชุดผูกกับ Resource ที่ถูกต้องตั้งแต่ต้น และไม่ต้องสร้าง Mutation ด้วย ID สมมติ

ระบบจริงควรเปลี่ยน `window.confirm()` เป็น Accessible Alert Dialog

## 12. สร้าง Todos Page

สร้าง `src/features/todos/pages/todos-page.tsx`

```tsx
import { AddTodoPanel } from "../components/todo-mutation-panel";
import { RandomTodosPanel } from "../components/random-todos-panel";
import { TodosTable } from "../components/todos-table";
import { TodosToolbar } from "../components/todos-toolbar";
import type { TodosListResponse } from "../api/contracts";
import type { TodosListQueryInput } from "../api/queries";
import { Button } from "#/shared/ui/button";
import { Card } from "#/shared/ui/card";

interface TodosPageProps {
  data: TodosListResponse;
  search: TodosListQueryInput;
  onSearchChange: (next: Partial<TodosListQueryInput>) => void;
  onReset: () => void;
}

export function TodosPage({ data, search, onSearchChange, onReset }: TodosPageProps) {
  const lastPage =
    search.source === "all" ? Math.max(1, Math.ceil(data.total / search.pageSize)) : 1;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">DummyJSON Reference Feature</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Todos</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          โมดูลนี้แสดง URL State, Query Cache, Runtime Contract, Random Command และ Mutation Cache
          Projection โดยใช้ Domain ที่เรียบง่าย
        </p>
      </div>

      <TodosToolbar search={search} onChange={onSearchChange} onReset={onReset} />

      <Card className="space-y-4 ring-0">
        <TodosTable todos={data.todos} />

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {search.source === "all"
              ? `หน้า ${search.page} จาก ${lastPage} · ทั้งหมด ${data.total} รายการ`
              : `Todos ของ User #${search.userId} · ทั้งหมด ${data.total} รายการ`}
          </p>

          {search.source === "all" ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={search.page <= 1}
                onClick={() => onSearchChange({ page: search.page - 1 })}
              >
                ก่อนหน้า
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={search.page >= lastPage}
                onClick={() => onSearchChange({ page: search.page + 1 })}
              >
                ถัดไป
              </Button>
            </div>
          ) : null}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <AddTodoPanel activeListInput={search} />
        <RandomTodosPanel />
      </div>
    </section>
  );
}
```

## 13. สร้าง Todo Detail Page

สร้าง `src/features/todos/pages/todo-detail-page.tsx`

```tsx
import { Link } from "@tanstack/react-router";

import { EditTodoPanel } from "../components/todo-mutation-panel";
import type { Todo } from "../api/contracts";
import { Button } from "#/shared/ui/button";

interface TodoDetailPageProps {
  todo: Todo;
  onDeleted: () => void;
}

export function TodoDetailPage({ todo, onDeleted }: TodoDetailPageProps) {
  return (
    <section className="space-y-6">
      <Button asChild variant="outline" size="sm">
        <Link
          to="/todos"
          search={{
            page: 1,
            pageSize: 10,
            source: "all",
            userId: null,
          }}
        >
          กลับไป Todos
        </Link>
      </Button>

      <article className="space-y-4">
        <div>
          <p className="text-sm font-medium text-primary">Todo #{todo.id}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{todo.todo}</h1>
        </div>

        <dl className="grid gap-3 rounded-xl border bg-card p-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">สถานะ</dt>
            <dd className="font-medium">{todo.completed ? "เสร็จแล้ว" : "ยังไม่เสร็จ"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">ผู้ใช้งาน</dt>
            <dd className="font-medium">User #{todo.userId}</dd>
          </div>
        </dl>
      </article>

      <EditTodoPanel todo={todo} onDeleted={onDeleted} />
    </section>
  );
}
```

## 14. สร้าง Public API ของ Feature

สร้าง `src/features/todos/index.ts`

```ts
export { todoDetailQueryOptions, todosListQueryOptions } from "./api/queries";
export type { TodosListQueryInput } from "./api/queries";
export { TodoDetailPage } from "./pages/todo-detail-page";
export { TodosPage } from "./pages/todos-page";
```

Route ต้อง Import ผ่าน `#/features/todos` เท่านั้น

```ts
import { TodosPage, todosListQueryOptions } from "#/features/todos";
```

ไม่ควรเข้าถึง Internal File ของ Feature โดยตรง

## 15. สร้าง Todos List Route

สร้าง `src/routes/todos/index.tsx`

```tsx
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { TodosPage, todosListQueryOptions } from "#/features/todos";
import type { TodosListQueryInput } from "#/features/todos";
import { Button } from "#/shared/ui/button";

const todosSearchSchema = z
  .object({
    page: z.coerce.number().int().min(1).catch(1),
    pageSize: z.coerce.number().int().min(5).max(50).catch(10),
    source: z.enum(["all", "user"]).catch("all"),
    userId: z.union([z.coerce.number().int().positive(), z.null()]).catch(null),
  })
  .transform((value): TodosListQueryInput => {
    if (value.source === "user") {
      return {
        ...value,
        page: 1,
        userId: value.userId ?? 1,
      };
    }

    return {
      ...value,
      userId: null,
    };
  });

const defaultSearch: TodosListQueryInput = {
  page: 1,
  pageSize: 10,
  source: "all",
  userId: null,
};

export const Route = createFileRoute("/todos/")({
  validateSearch: (search) => todosSearchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(todosListQueryOptions(deps)),
  pendingComponent: () => <p className="py-12 text-muted-foreground">กำลังโหลด Todos…</p>,
  errorComponent: ({ error, reset }) => (
    <div className="space-y-4 rounded-xl border border-destructive/30 bg-destructive/5 p-6">
      <h1 className="font-semibold">ไม่สามารถโหลด Todos ได้</h1>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <Button variant="outline" onClick={reset}>
        ลองอีกครั้ง
      </Button>
    </div>
  ),
  component: TodosRoute,
});

function TodosRoute() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data } = useSuspenseQuery(todosListQueryOptions(search));

  return (
    <TodosPage
      data={data}
      search={search}
      onSearchChange={(next) => {
        void navigate({
          search: (previous) => ({ ...previous, ...next }),
        });
      }}
      onReset={() => {
        void navigate({ search: defaultSearch });
      }}
    />
  );
}
```

### Search Normalization

Direct URL นี้

```text
/todos?source=user
```

ถูก Normalize เป็น

```text
source=user
userId=1
page=1
```

ส่วน All Scope จะ Normalize `userId` กลับเป็น `null` ลด Invalid State ภายใน Application

## 16. สร้าง Todo Detail Route

สร้าง `src/routes/todos/$todoId.tsx`

```tsx
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { TodoDetailPage, todoDetailQueryOptions } from "#/features/todos";
import { Button } from "#/shared/ui/button";

const todoIdSchema = z.coerce.number().int().positive();

const defaultTodosSearch = {
  page: 1,
  pageSize: 10,
  source: "all" as const,
  userId: null,
};

export const Route = createFileRoute("/todos/$todoId")({
  loader: ({ context, params }) => {
    const todoId = todoIdSchema.parse(params.todoId);

    return context.queryClient.ensureQueryData(todoDetailQueryOptions(todoId));
  },
  pendingComponent: () => <p className="py-12 text-muted-foreground">กำลังโหลด Todo…</p>,
  errorComponent: ({ error, reset }) => (
    <div className="space-y-4 rounded-xl border border-destructive/30 bg-destructive/5 p-6">
      <h1 className="font-semibold">ไม่สามารถโหลด Todo ได้</h1>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <Button variant="outline" onClick={reset}>
        ลองอีกครั้ง
      </Button>
    </div>
  ),
  component: TodoDetailRoute,
});

function TodoDetailRoute() {
  const navigate = Route.useNavigate();
  const { todoId: rawTodoId } = Route.useParams();
  const todoId = todoIdSchema.parse(rawTodoId);
  const { data } = useSuspenseQuery(todoDetailQueryOptions(todoId));

  return (
    <TodoDetailPage
      todo={data}
      onDeleted={() => {
        void navigate({
          to: "/todos",
          search: defaultTodosSearch,
        });
      }}
    />
  );
}
```

Route Loader และ Component ใช้ Query Options เดียวกัน

## 17. เพิ่ม Navigation

แก้ `src/shared/components/ui/app-shell.tsx`

เพิ่ม Link ใน `<nav>`

```tsx
<Link
  to="/todos"
  search={{
    page: 1,
    pageSize: 10,
    source: "all",
    userId: null,
  }}
  className="text-muted-foreground transition-colors hover:text-foreground"
>
  Todos example
</Link>
```

AppShell ทำหน้าที่ประกอบ Navigation เท่านั้น ไม่ Import Todos Page หรือ API Client

## 18. สร้าง MSW Handlers ครบ API

แก้ `src/test/msw/handlers.ts`

```ts
import { HttpResponse, http } from "msw";

const todo = {
  id: 1,
  todo: "Define clear frontend architecture boundaries",
  completed: false,
  userId: 7,
};

const completedTodo = {
  id: 2,
  todo: "Validate every external contract",
  completed: true,
  userId: 7,
};

const todosResponse = {
  todos: [todo, completedTodo],
  total: 2,
  skip: 0,
  limit: 10,
};

export const handlers = [
  http.get("*/users", () =>
    HttpResponse.json({
      users: [
        {
          id: 1,
          firstName: "Ada",
          lastName: "Lovelace",
          email: "ada@example.com",
          image: "https://example.com/ada.png",
          role: "admin",
        },
      ],
      total: 1,
      skip: 0,
      limit: 10,
    }),
  ),

  http.get("*/todos/random/:count", ({ params }) => {
    const count = Number(params.count);
    return HttpResponse.json(
      Array.from({ length: count }, (_, index) => ({ ...todo, id: index + 1 })),
    );
  }),

  http.get("*/todos/random", () => HttpResponse.json(todo)),

  http.get("*/todos/user/:userId", ({ params }) =>
    HttpResponse.json({
      ...todosResponse,
      todos: todosResponse.todos.map((item) => ({
        ...item,
        userId: Number(params.userId),
      })),
    }),
  ),

  http.post("*/todos/add", async ({ request }) => {
    const input = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ ...input, id: 151 });
  }),

  http.patch("*/todos/:todoId", async ({ params, request }) => {
    const input = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ ...todo, ...input, id: Number(params.todoId) });
  }),

  http.delete("*/todos/:todoId", ({ params }) =>
    HttpResponse.json({
      ...todo,
      id: Number(params.todoId),
      isDeleted: true,
      deletedOn: "2026-08-02T12:00:00.000Z",
    }),
  ),

  http.get("*/todos/:todoId", ({ params }) =>
    HttpResponse.json({ ...todo, id: Number(params.todoId) }),
  ),

  http.get("*/todos", ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") ?? 10);
    const skip = Number(url.searchParams.get("skip") ?? 0);

    return HttpResponse.json({
      ...todosResponse,
      limit,
      skip,
    });
  }),
];
```

ลำดับ Handler สำคัญ

```text
/todos/random/:count
/todos/random
/todos/user/:userId
/todos/add
/todos/:todoId
/todos
```

Path เฉพาะต้องอยู่ก่อน Dynamic Path เพื่อไม่ให้ `/todos/random` ถูกตีความเป็น `todoId=random`

## 19. เขียน API Integration Tests

สร้าง `src/features/todos/api/client.test.ts`

```ts
import {
  addTodo,
  deleteTodo,
  getRandomTodo,
  getRandomTodos,
  getTodo,
  getTodos,
  getTodosByUser,
  updateTodo,
} from "./client";

const expectedText = "Define clear frontend architecture boundaries";

describe("Todos API client", () => {
  it("โหลด Todos พร้อม Limit และ Skip", async () => {
    const result = await getTodos({ page: 2, pageSize: 10 });

    expect(result.skip).toBe(10);
    expect(result.limit).toBe(10);
    expect(result.todos[0]?.todo).toBe(expectedText);
  });

  it("โหลด Todo รายการเดียว", async () => {
    const result = await getTodo({ todoId: 1 });
    expect(result.todo).toBe(expectedText);
  });

  it("โหลด Todos ตาม User ID", async () => {
    const result = await getTodosByUser({ userId: 5 });
    expect(result.todos.every((todo) => todo.userId === 5)).toBe(true);
  });

  it("สุ่ม Todo หนึ่งรายการ", async () => {
    const result = await getRandomTodo();
    expect(result.id).toBe(1);
  });

  it("สุ่ม Todos หลายรายการ", async () => {
    const result = await getRandomTodos({ count: 3 });
    expect(result).toHaveLength(3);
  });

  it("จำลองการเพิ่ม Todo", async () => {
    const result = await addTodo({
      input: {
        todo: "Ship a tested Todos module",
        completed: false,
        userId: 7,
      },
    });

    expect(result.id).toBe(151);
  });

  it("จำลองการแก้ไข Todo", async () => {
    const result = await updateTodo({
      todoId: 1,
      input: { completed: true },
    });

    expect(result.completed).toBe(true);
  });

  it("จำลองการลบ Todo", async () => {
    const result = await deleteTodo({ todoId: 1 });

    expect(result.isDeleted).toBe(true);
    expect(result.deletedOn).toBe("2026-08-02T12:00:00.000Z");
  });
});
```

Integration Test ชุดนี้ใช้

```text
Feature Client จริง
  → Shared Axios Client จริง
  → MSW
  → Zod Contract จริง
```

จึงตรวจ Boundary ได้มากกว่าการ Mock Function ภายใน Client

## 20. เพิ่ม Invalid Contract Test

เพิ่ม Test เพื่อยืนยันว่า Contract Drift ถูกตรวจพบ

```ts
import { HttpResponse, http } from "msw";

import { getTodo } from "./client";
import { server } from "#/test/msw/server";

test("แปลง Invalid API Response เป็น API_CONTRACT_ERROR", async () => {
  server.use(
    http.get("*/todos/999", () =>
      HttpResponse.json({
        id: 999,
        todo: "",
        completed: "not-a-boolean",
        userId: null,
      }),
    ),
  );

  await expect(getTodo({ todoId: 999 })).rejects.toMatchObject({
    code: "API_CONTRACT_ERROR",
  });
});
```

Test นี้พิสูจน์ว่า Type Safety ไม่ได้พึ่ง TypeScript เพียงอย่างเดียว

## 21. เขียน Component Test

สร้าง `src/features/todos/components/todos-table.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

import { TodosTable } from "./todos-table";

function renderTable() {
  const rootRoute = createRootRoute();
  const todoRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "todos/$todoId",
    component: () => (
      <TodosTable
        todos={[
          {
            id: 1,
            todo: "Define clear frontend architecture boundaries",
            completed: false,
            userId: 7,
          },
        ]}
      />
    ),
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([todoRoute]),
    history: createMemoryHistory({ initialEntries: ["/todos/1"] }),
  });

  return render(<RouterProvider router={router} />);
}

describe("TodosTable", () => {
  it("แสดง Todo, Status และ User", async () => {
    renderTable();

    expect(
      await screen.findByText("Define clear frontend architecture boundaries"),
    ).toBeInTheDocument();
    expect(screen.getByText("ยังไม่เสร็จ")).toBeInTheDocument();
    expect(screen.getByText("User #7")).toBeInTheDocument();
  });
});
```

หาก Test Router สร้างภาระเกินไป ให้แยก Row Presentation ที่ไม่มี `Link` ออกมา Test ต่างหาก และให้ E2E รับผิดชอบ Navigation

## 22. สร้าง Route Tree และตรวจ Type

```bash
bun run routes:generate
bun run typecheck
```

ตรวจว่า `src/routeTree.gen.ts` มี Route

```text
/todos/
/todos/$todoId
```

ห้ามแก้ `src/routeTree.gen.ts` ด้วยมือ

## 23. ตรวจ Flow ด้วย Browser

เปิด

```text
http://localhost:3000/todos
```

ตรวจตามลำดับ

1. หน้าแรกแสดง Todos List
2. เปลี่ยน Page แล้ว URL เปลี่ยน
3. เปลี่ยน Page Size แล้ว Page Reset เป็น 1
4. เปลี่ยน Source เป็น User แล้ว User ID ถูกกำหนด
5. เปลี่ยน User ID แล้วเรียก `/todos/user/:userId`
6. กด Todo แล้วไป `/todos/:id`
7. Detail Route โหลดข้อมูลผ่าน Loader
8. Add Form ส่ง `POST /todos/add`
9. Edit Form ส่ง `PATCH /todos/:id`
10. Delete ส่ง `DELETE /todos/:id` แล้วกลับ List
11. Random จำนวน 1 เรียก `/todos/random`
12. Random จำนวน 2–10 เรียก `/todos/random/:count`
13. Refresh หลัง Mutation แล้วข้อมูลกลับเป็น Dataset เดิมตามพฤติกรรม DummyJSON

ใช้ TanStack Router Devtools ตรวจ Search/Params และ React Query Devtools ตรวจ Query Keys/Cache

## 24. เพิ่ม E2E Test

เพิ่มกรณีใน `e2e/smoke.spec.ts`

```ts
import { expect, test } from "@playwright/test";

const todo = {
  id: 1,
  todo: "Define clear frontend architecture boundaries",
  completed: false,
  userId: 7,
};

test("เปิด Todos, เปลี่ยนหน้า และเข้าหน้ารายละเอียด", async ({ page }) => {
  await page.route("**/todos?*", async (route) => {
    const url = new URL(route.request().url());
    const skip = Number(url.searchParams.get("skip") ?? 0);
    const limit = Number(url.searchParams.get("limit") ?? 10);

    await route.fulfill({
      json: {
        todos: [todo],
        total: 20,
        skip,
        limit,
      },
    });
  });

  await page.route("**/todos/1", async (route) => {
    await route.fulfill({ json: todo });
  });

  await page.goto("/todos?page=1&pageSize=10&source=all");

  await expect(page.getByRole("heading", { name: "Todos" })).toBeVisible();
  await expect(page.getByText(todo.todo)).toBeVisible();

  await page.getByRole("button", { name: "ถัดไป" }).click();
  await expect(page).toHaveURL(/page=2/);

  await page.getByRole("link", { name: todo.todo }).click();
  await expect(page).toHaveURL("/todos/1");
  await expect(page.getByRole("heading", { name: todo.todo })).toBeVisible();
});
```

E2E ตรวจเฉพาะ Critical Journey ส่วน Contract และ Edge Cases อยู่ใน Vitest/MSW

## 25. รัน Quality Gate

จัดรูปแบบและตรวจทั้งหมด

```bash
bun run format
bun run lint
bun run typecheck
bun run test:run
bun run build
bun run test:e2e
```

หรือ

```bash
bun run check
bun run test:e2e
```

ตรวจ Git Diff

```bash
git status
git diff --check
git diff
```

Generated Route Tree อาจเปลี่ยนจากคำสั่ง `routes:generate` ให้ตรวจว่าเปลี่ยนเฉพาะ Route ที่เพิ่ม

## 26. Cache Behavior ที่ต้องเข้าใจ

### List Cache

```text
/todos?page=1&pageSize=10
  → ['todos', 'list', { source: 'all', page: 1, pageSize: 10 }]

/todos?page=2&pageSize=10
  → ['todos', 'list', { source: 'all', page: 2, pageSize: 10 }]
```

### User Cache

```text
/todos?source=user&userId=5
  → ['todos', 'list', { source: 'user', userId: 5 }]
```

Page และ Page Size ไม่สร้าง Cache ซ้ำใน User Scope

### Detail Cache

```text
/todos/1
  → ['todos', 'detail', 1]
```

### Update

```text
PATCH /todos/1
  → set detail cache
  → replace item ใน list cache ที่มี Todo #1
```

### Delete

```text
DELETE /todos/1
  → remove detail cache
  → remove item จาก list caches
  → decrement total เฉพาะ cache ที่มี item
```

### Random

```text
Click → mutation → fresh result
```

ไม่ใช้ Query Cache เพราะผลลัพธ์ต้องเปลี่ยนทุกครั้ง

## 27. Production Checklist

ก่อนเปลี่ยนจาก DummyJSON เป็น API จริง

- Backend ตรวจ Authentication และ Permission หากข้อมูลไม่ใช่ Public
- Create/Update/Delete Persist จริงและคืน Resource Version ล่าสุด
- Mutation รองรับ Idempotency หรือ Duplicate-submit Protection ตามความเสี่ยง
- Error Response มี Contract กลาง
- Pagination เลือก Offset หรือ Cursor ตาม Dataset
- User Filter ตรวจ Permission ฝั่ง Server
- Random Endpoint มี Rate Limit หากต้นทุนสูง
- Form มี Accessible Label และ Error Summary
- Delete ใช้ Accessible Confirmation Dialog
- Audit Log ครอบคลุม Mutation สำคัญ
- Query Invalidation ตรงกับ Server Consistency Model
- Observability ไม่เก็บ Personal Data เกินจำเป็น
- E2E ใช้ Test Environment แยกจาก Production
- CORS และ CSP ถูกตั้งค่าตาม Domain จริง
- Source Map Policy สอดคล้องกับ Security Requirement

## 28. Definition of Done

โมดูล Todos พร้อม Merge เมื่อ

- API ทุก Endpoint ในตารางต้นเอกสารถูกเรียกผ่าน Feature Client
- Response ทุกชนิดผ่าน Zod
- Numeric Fields ถูก Normalize ก่อนเข้า Cache
- Query Key ไม่ชนกันระหว่าง All และ User Scope
- Query Key ไม่เก็บ Input ที่ไม่เกี่ยวข้องกับ Resource
- URL เก็บ Source, User ID และ Pagination
- Loader Prefetch ผ่าน Query Options เดียวกับ Component
- Random Flow ใช้ Command Semantics ที่ชัดเจน
- Add/Update/Delete มี Cache Policy
- Detail Cache และ List Cache สอดคล้องหลัง Mutation
- Loading, Error, Empty และ Success State ครบ
- Request รองรับ AbortSignal
- MSW ไม่ปล่อย Unhandled Request
- Integration Test ครบ Read และ Write Flows
- Component Test ครอบคลุม Presentation สำคัญ
- E2E ครอบคลุม List → Pagination → Detail
- Route Tree Generate สำเร็จ
- ไม่มี Axios Import นอก Shared HTTP Client
- Shared Layer ไม่ Import Todos Feature
- `bun run check` ผ่าน
- `bun run test:e2e` ผ่าน

## 29. ลำดับ Commit ที่แนะนำ

```text
feat(todos): add runtime API contracts
feat(todos): add API clients and query options
feat(todos): add mutation cache policies
feat(todos): add list and detail UI
feat(todos): add typed routes and navigation
test(todos): add MSW integration and browser coverage
docs(todos): document module behavior
```

หรือ Squash เป็น Commit เดียวตามนโยบายทีม

## 30. เอกสารอ้างอิง

- [DummyJSON Todos](https://dummyjson.com/docs/todos)
- [DummyJSON Todos Source](https://github.com/Ovi/DummyJSON/blob/master/views/docs-todos.ejs)
- [TanStack Router File-based Routing](https://tanstack.com/router/latest/docs/routing/file-based-routing)
- [TanStack Router Data Loading](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading)
- [TanStack Query Query Options](https://tanstack.com/query/latest/docs/framework/react/guides/query-options)
- [TanStack Query Query Cancellation](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation)
- [TanStack Query Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)
- [TanStack Query Invalidations](https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations)
- [MSW](https://mswjs.io/docs/)
- [Playwright](https://playwright.dev/docs/intro)
