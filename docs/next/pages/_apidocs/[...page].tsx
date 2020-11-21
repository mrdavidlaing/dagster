import { promises as fs } from "fs";
import path from "path";

const ApiDocsPage = ({ body, data, page, curr }) => {
  const markup = { __html: body };

  return <div className="prose prose-sm" dangerouslySetInnerHTML={markup} />;
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
  const pathToFile = path.resolve(basePath, "api/sections.json");

  try {
    const buffer = await fs.readFile(pathToFile);
    const {
      api: { apidocs: data },
    } = JSON.parse(buffer.toString());

    let curr = data;
    for (const part of page) {
      curr = curr[part];
    }

    const { body } = curr;

    return {
      props: { body, data, page, curr },
    };
  } catch (err) {
    console.log(err);
    return {
      notFound: true,
    };
  }
}

export default ApiDocsPage;
