import dynamic from "next/dynamic";

const WhispersPrototype = dynamic(() => import("../components/WhispersPrototype"), { ssr: false });

export default function Home() {
  return <WhispersPrototype />;
}
