
import Head from "next/head";
import WhispersPrototype from "../components/WhispersPrototype";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Whispers</title>
      </Head>
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-4">Whispers Prototype</h1>
        <WhispersPrototype />
      </main>
    </div>
  );
}
