"use client";
import { useState } from "react";
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import { useHookFormMask } from "use-mask-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserRegister } from "../schema";
import { userRegisterSchema } from "../schema";
import toast from "react-hot-toast";

const Form = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isPasswordVisible2, setPasswordVisible2] = useState(false);
  const [address, setAddress] = useState({ city: "", street: "", state: "" });

  const {
    handleSubmit,
    register,
    setValue,
    setError,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<UserRegister>({ resolver: zodResolver(userRegisterSchema) });

  const registerWithMask = useHookFormMask(register);

  async function handleZipcodeBlur(e: any) {
    const zipcode = e.target.value;

    const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${zipcode}`);

    if (res.ok) {
      const data = await res.json();
      setAddress({
        city: data.city,
        street: data.street,
        state: data.state,
      });
      setValue("address", data.street), setValue("city", data.city);
    } else {
      console.log("Vou nadaa");
    }
    // https://brasilapi.com.br/api/cep/v2/{cep}
  }

  async function onSubmit(data: any) {
    console.log("Formulário enviado!");

    const res = await fetch(
      "https://apis.codante.io/api/register-user/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const resData = await res.json();
    if (!res.ok) {
      console.log(resData);
      for (const field in resData.errors) {
        setError(field as keyof UserRegister, {
          type: "manual",
          message: resData.errors[field],
        });
      }
      toast.error("Erro ao cadastrar usuário");
    } else {
      console.log(resData);
      toast.success("Usuário cadastrado com sucesso!");
      reset();
    }
  }

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2 flex flex-col">
        <label htmlFor="name">Nome Completo</label>
        <input type="text" id="name" {...register("name")} />
        {/* Sugestão de exibição de erro de validação */}

        <p className="text-xs text-red-400 mt-1">
          {errors.name?.message as string}
        </p>
      </div>
      <div className="mb-2 flex-col flex">
        <label htmlFor="email">E-mail</label>
        <input className="" type="email" id="email" {...register("email")} />
        <p className="text-xs text-red-400 mt-1">
          {errors.email?.message as string}
        </p>
      </div>
      <div className="mb-2">
        <label htmlFor="password">Senha</label>
        <div className="relative flex items-center">
          <input
            type={isPasswordVisible ? "text" : "password"}
            id="password"
            className="w-full"
            {...register("password")}
          />

          <span className="absolute right-3">
            <button
              type="button"
              onClick={() => setPasswordVisible(!isPasswordVisible)}
            >
              {!isPasswordVisible ? (
                <EyeIcon size={20} className="text-slate-600 cursor-pointer" />
              ) : (
                <EyeOffIcon
                  className="text-slate-600 cursor-pointer"
                  size={20}
                />
              )}
            </button>
          </span>
        </div>
        <p className="text-xs text-red-400 mt-1">
          {errors.password?.message as string}
        </p>
      </div>
      <div className="mb-2">
        <label htmlFor="confirm-password">Confirmar Senha</label>
        <div className="relative flex items-center">
          <input
            type={isPasswordVisible2 ? "text" : "password"}
            id="confirm-password"
            className="w-full"
            {...register("password_confirmation")}
          />
          <span className="absolute right-3">
            <button
              type="button"
              onClick={() => setPasswordVisible2(!isPasswordVisible2)}
            >
              {!isPasswordVisible2 ? (
                <EyeIcon size={20} className="text-slate-600 cursor-pointer" />
              ) : (
                <EyeOffIcon
                  className="text-slate-600 cursor-pointer"
                  size={20}
                />
              )}
            </button>
          </span>
        </div>
        <p className="text-xs text-red-400 mt-1">
          {errors.password_confirmation?.message as string}
        </p>
      </div>
      <div className="mb-2 flex flex-col">
        <label htmlFor="phone">Telefone Celular</label>
        <input
          type="text"
          id="phone"
          {...registerWithMask("phone", "(99) 99999-9999")}
        />
      </div>
      <p className="text-xs text-red-400 mt-1">
        {errors.phone?.message as string}
      </p>
      <div className="mb-2 flex flex-col">
        <label htmlFor="cpf">CPF</label>
        <input
          type="text"
          id="cpf"
          {...registerWithMask("cpf", "999.999.999-99")}
        />
        <p className="text-xs text-red-400 mt-1">
          {errors.cpf?.message as string}
        </p>
      </div>
      <div className="mb-2 flex flex-col">
        <label htmlFor="cep">CEP</label>
        <input
          type="text"
          id="cep"
          {...registerWithMask("zipcode", "99999-999")}
          onBlur={handleZipcodeBlur}
        />
        <p className="text-xs text-red-400 mt-1">
          {errors.zipcode?.message as string}
        </p>
      </div>
      <div className="mb-2 flex flex-col">
        <label htmlFor="address">Endereço</label>
        <input
          className="disabled:bg-slate-200"
          type="text"
          id="address"
          disabled
          value={address.street}
          {...register("address")}
        />
      </div>

      <div className="mb-4 flex flex-row gap-4">
        <div className="flex flex-col">
          <label htmlFor="city">Cidade</label>
          <input
            className="disabled:bg-slate-200"
            type="text"
            id="city"
            disabled
            value={address.city}
            {...register("city")}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="uf">UF</label>
          <input
            className="disabled:bg-slate-200 max-w-10"
            type="text"
            id="uf"
            disabled
            value={address.state}
          />
        </div>
      </div>
      {/* terms and conditions input */}
      <div className="mb-4">
        <input
          type="checkbox"
          id="terms"
          className="mr-2 accent-slate-500"
          {...register("terms")}
        />
        <label
          className="text-sm  font-light text-slate-500 mb-1 inline"
          htmlFor="terms"
        >
          Aceito os{" "}
          <span className="underline hover:text-slate-900 cursor-pointer">
            termos e condições
          </span>
        </label>
        <p className="text-xs text-red-400 mt-1">
          {errors.terms?.message as string}
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-slate-500 font-semibold text-white w-full rounded-xl p-4 mt-10 hover:bg-slate-600 transition-colors disabled:bg-slate-300 flex justify-center"
      >
        {isSubmitting ? <Loader className="animate-spin" /> : "Cadastrar"}
      </button>
    </form>
  );
};

export default Form;
