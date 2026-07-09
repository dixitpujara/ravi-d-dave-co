import { SITE_MARKUP } from "./site-markup";
import Interactions from "./Interactions";

export default function Home() {
  return (
    <>
      {/* Server-rendered marketing markup (fully SSR'd for SEO). Static, trusted content. */}
      <div dangerouslySetInnerHTML={{ __html: SITE_MARKUP }} />
      <Interactions />
    </>
  );
}
