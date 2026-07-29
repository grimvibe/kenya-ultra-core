import { Firestore } from "@google-cloud/firestore";

// Uses Application Default Credentials — no key file needed
// when running on Cloud Run within the same GCP project.
// The service's runtime service account needs the
// "Cloud Datastore User" (roles/datastore.user) IAM role.

const firestore = new Firestore();

export default firestore;
