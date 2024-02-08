import * as Yup from "yup";

const manualEntrySchema = Yup.object().shape({
  name: Yup.string().required("Please provide the client's name"),
  jobType: Yup.string().required(
    "Please select the service/job being provided."
  ),
  address: Yup.string().required("Please provide the address of this job."),
  time: Yup.string().required("Please provide a time slot for this job"),
  leadSource: Yup.string().required("Please select a lead source."),
});

export { manualEntrySchema };
