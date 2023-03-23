import { createMemo, createResource, createSignal, Suspense } from "solid-js";

export default function Page() {
  const [useResource, setUseResource] = createSignal(false);

  return (
    <main>
      <button onClick={() => setUseResource((prev) => !prev)}>
        Click me to boom!
      </button>
      <Suspense fallback="yay boom!">
        <Display useResource={useResource()} />
      </Suspense>
    </main>
  );
}

function Display(props: { useResource: boolean }) {
  const [resource] = createResource(() => {
    if (import.meta.env.SSR) {
      console.log(
        "The fetcher gets called, but the result is not streamed to client"
      );
    } else {
      console.log(
        "The fetcher never gets called in client, even though the resource has no value. Therefore it stales as pending."
      );
    }
    return new Promise<"foo">((resolve) =>
      setTimeout(() => resolve("foo"), 3000)
    );
  });

  const value = createMemo(() => {
    const value = props.useResource && resource();
    return `Value: ${value}`;
  });

  return <span>{value()}</span>;
}
