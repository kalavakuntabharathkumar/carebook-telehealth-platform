import { z } from "zod";

const emailSchema = z.string().email();
describe("booking input validation primitives", () => {
  it("accepts a valid email", () => expect(emailSchema.safeParse("patient@example.com").success).toBe(true));
  it("rejects an invalid email", () => expect(emailSchema.safeParse("not-an-email").success).toBe(false));
});
