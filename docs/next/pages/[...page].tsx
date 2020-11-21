import { promises as fs } from "fs";
import path from "path";
import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";
import Pagination from "../components/Pagination";
import VersionedLink from "../components/VersionedLink";

const components = {
  VersionedLink,
};

const DocsPage = ({ source }) => {
  const content = hydrate(source, { components });
  return (
    <div>
      <div className="prose max-w-none">{content}</div>
      <Pagination />
    </div>
  );
};

const basePathForVersion = (version: string) => {
  if (version === "master") {
    return path.resolve("content");
  }

  return path.resolve(".versioned_content", version);
};

export async function getServerSideProps({ params, locale }) {
  const { page } = params;

  const basePath = basePathForVersion(locale);
  const pathToFile = path.resolve(basePath, page.join("/") + ".mdx");

  try {
    const buffer = await fs.readFile(pathToFile);
    const content = buffer.toString();
    const source = await renderToString(content, components);

    return {
      props: { source },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
}

export default DocsPage;
