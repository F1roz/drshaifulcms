import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.TINA_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || "main",
  clientId: process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "assets/img",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "pages",
        label: "Site Pages",
        path: "src/content/pages",
        format: "md",
        ui: {
          // Fixed set of pages — client edits existing ones, doesn't create new top-level pages here
          allowedActions: { create: false, delete: false },
        },
        fields: [
          { type: "string", name: "title", label: "Page Title", isTitle: true, required: true },
          { type: "string", name: "description", label: "SEO Description", ui: { component: "textarea" } },
          { type: "rich-text", name: "body", label: "Page Content", isBody: true },
        ],
      },
      {
        name: "procedures",
        label: "Procedures",
        path: "src/content/procedures",
        format: "md",
        ui: {
          // Client CAN add/remove procedure pages
          allowedActions: { create: true, delete: true },
          router: ({ document }) => `/procedures/${document._sys.filename}`,
        },
        fields: [
          { type: "string", name: "title", label: "Procedure Name", isTitle: true, required: true },
          {
            type: "string",
            name: "category",
            label: "Category",
            options: [
              "General Paediatric Surgery",
              "Neonatal Surgery",
              "Minimal Access Surgery",
              "Paediatric Urology",
              "Paediatric Hepatobiliary Surgery",
              "Paediatric Surgical Oncology",
            ],
            required: true,
          },
          { type: "string", name: "description", label: "Short Description (shown on listing page)", ui: { component: "textarea" } },
          { type: "image", name: "image", label: "Header Image" },
          { type: "number", name: "order", label: "Display Order" },
          {
            type: "string",
            name: "related",
            label: "Related Procedures (filenames, e.g. circumcision)",
            list: true,
          },
          { type: "rich-text", name: "body", label: "Procedure Details", isBody: true },
        ],
      },
      {
        name: "settings",
        label: "Global Site Settings",
        path: "src/content/settings",
        format: "json",
        ui: {
          allowedActions: { create: false, delete: false },
          global: true,
        },
        fields: [
          { type: "string", name: "brandName", label: "Doctor / Brand Name" },
          { type: "string", name: "brandRole", label: "Title / Role" },
          { type: "string", name: "footerTagline", label: "Footer Tagline", ui: { component: "textarea" } },
          {
            type: "object",
            name: "social",
            label: "Social Links",
            fields: [
              { type: "string", name: "facebook", label: "Facebook URL" },
              { type: "string", name: "linkedin", label: "LinkedIn URL" },
              { type: "string", name: "youtube", label: "YouTube URL" },
            ],
          },
          { type: "string", name: "copyright", label: "Copyright Line" },
          { type: "string", name: "disclaimer", label: "Disclaimer Line" },
        ],
      },
    ],
  },
});
