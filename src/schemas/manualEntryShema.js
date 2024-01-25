import * as Yup from "yup";

const manualEntrySchema = Yup.object().shape({
  Name: Yup.string().required(),
  Job_Type: Yup.string().required(),
  Address: Yup.string().required(),
  Time: Yup.string().required(),
  Lead_Source: Yup.string().required(),
  notes: Yup.string(),
});

export { manualEntrySchema };
