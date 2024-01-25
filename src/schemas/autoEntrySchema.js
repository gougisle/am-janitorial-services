import * as Yup from "yup";

const autoEntrySchema = Yup.object().shape({
  leadSource: Yup.number()
    .min(1, "Please select valid lead source")
    .required("Please select valid lead source"),
  leads: Yup.array().of(
    Yup.object().shape({
      text: Yup.string().required(
        "Please provide valid lead or delete this box"
      ),
    })
  ),
});

export { autoEntrySchema };
