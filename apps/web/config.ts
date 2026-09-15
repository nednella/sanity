type Config = {
  apiUrl: string;
};

const required = (name: keyof ImportMetaEnv): string => {
  const value = import.meta.env[name];
  if (!value) throw new Error(`missing environment variable: ${name}`);
  return value;
};

export const config: Config = {
  apiUrl: required("VITE_API_URL")
};
