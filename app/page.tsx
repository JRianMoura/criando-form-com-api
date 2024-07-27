import Image from "next/image";
import FormHeader from "./components/FormHeader";
import Form from "./components/Form";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <main className="bg-sky-50 p-10 flex justify-center items-center">
      <div className="container max-w-[600px] xl:max-w-[450px] px-10 py-6 border-slate-300 border-2 rounded-2xl bg-white flex flex-col">
        <Toaster />
        <FormHeader />
        <Form />
      </div>
    </main>
  );
}
