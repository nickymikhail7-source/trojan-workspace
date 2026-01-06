import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// WorkspaceInterior now redirects to the main branch (chat-first approach)
export default function WorkspaceInterior() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to main branch - workspace IS the chat now
    navigate(`/workspace/${id}/branch/main`, { replace: true });
  }, [id, navigate]);

  // Return null since we're redirecting
  return null;
}
