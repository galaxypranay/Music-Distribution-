export interface Release {
  id: string;
  artist_name: string;
  song_title: string;
  genre: string;
  release_date: string;
  audio_url: string;
  status: "Pending Review" | "Approved" | "Rejected";
  rejection_reason?: string | null;
  created_at: string;
}

export type ReleaseStatus = Release["status"];

export interface UploadFormData {
  songTitle: string;
  genre: string;
  releaseDate: string;
  audioFile: File | null;
}

export interface ToastState {
  message: string;
  type: "success" | "error" | "info";
  visible: boolean;
}

export interface SupportTicket {
  id: string;
  artist_name: string;
  subject: string;
  message: string;
  status: "Open" | "Resolved";
  created_at: string;
}
