import z from "zod";

export const userRegisterSchema = z
  .object({
    name: z.string().min(1, { message: "O nome precisa ser preenchido." }),
    email: z
      .string()
      .min(1, { message: "O email precisa ser preenchido." })
      .email({ message: "Email inválido." }),
    password: z
      .string()
      .min(8, { message: "A senha deve ter no mínimo 8 caracteres." }),
    password_confirmation: z.string().min(8, {
      message: "A confirmação da senha deve ter no mínimo 8 caracteres.",
    }),
    phone: z
      .string()
      .min(1, { message: "O telefone precisa ser preenchido." })
      .regex(/^\(\d{2}\) \d{5}-\d{4}$/, { message: "Telefone inválido" }),
    cpf: z
      .string()
      .min(1, { message: "O cpf precisa ser preenchido." })
      .regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, { message: "CPF inválido!" }),
    zipcode: z
      .string()
      .min(1, { message: "O cep precisa ser preenchido." })
      .regex(/^\d{5}\-\d{3}$/, { message: "CEP inválido!" }),
    city: z.string().min(1, { message: "A cidade precisa ser preenchida." }),
    address: z.string().min(1, { message: "Estado precisa ser preenchido." }),
    terms: z.boolean({ message: "Você precisa aceitar os termos de uso." }),
  })
  .refine(
    (data) => {
      return data.password === data.password_confirmation;
    },
    {
      message: "As senhas devem coincidir.",
      path: ["password_confirmation"],
    }
  );

export type UserRegister = z.infer<typeof userRegisterSchema>;
