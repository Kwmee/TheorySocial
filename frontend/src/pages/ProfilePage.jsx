import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TheoryList } from "../components/TheoryList";
import { UserAvatar } from "../components/UserAvatar";
import { useAuth } from "../hooks/useAuth";
import {
  deleteTheory,
  fetchMyTheories,
  fetchTheoriesByUsername,
  fetchUserProfile,
  uploadProfileImage,
  voteTheory,
} from "../services/api";
import { enrichTheory } from "../services/theoryTopics";

export function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const isOwnProfile = !username || username === user?.username;
  const profileUser = isOwnProfile ? user : null;

  const [publicProfile, setPublicProfile] = useState(null);
  const [theories, setTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [profileForm, setProfileForm] = useState({
    username: user?.username ?? "",
    bio: user?.bio ?? "",
    profileImageUrl: user?.profileImageUrl ?? "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileFeedback, setProfileFeedback] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState("");

  useEffect(() => {
    if (!isOwnProfile) {
      return;
    }

    setProfileForm({
      username: user?.username ?? "",
      bio: user?.bio ?? "",
      profileImageUrl: user?.profileImageUrl ?? "",
    });
    setProfilePreviewUrl("");
    setProfileImageFile(null);
  }, [isOwnProfile, user?.bio, user?.profileImageUrl, user?.username]);

  useEffect(() => {
    if (!profileImageFile) {
      return undefined;
    }

    const previewUrl = URL.createObjectURL(profileImageFile);
    setProfilePreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [profileImageFile]);

  useEffect(() => {
    let active = true;

    async function loadProfilePage() {
      setLoading(true);
      setError("");

      try {
        const [profileData, theoryData] = await Promise.all(
          isOwnProfile
            ? [Promise.resolve(user), fetchMyTheories()]
            : [fetchUserProfile(username), fetchTheoriesByUsername(username)],
        );

        if (!active) {
          return;
        }

        setPublicProfile(isOwnProfile ? null : profileData);
        setTheories(theoryData.map(enrichTheory));
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (isOwnProfile && !user) {
      return;
    }

    loadProfilePage();

    return () => {
      active = false;
    };
  }, [isOwnProfile, user, username]);

  const currentProfile = isOwnProfile ? profileUser : publicProfile;

  const handleVote = async (theoryId, value) => {
    const updated = enrichTheory(await voteTheory(theoryId, value));
    setTheories((current) => current.map((theory) => (theory.id === theoryId ? updated : theory)));
    return updated;
  };

  const handleDelete = async (theoryId) => {
    setDeletingId(theoryId);
    setError("");

    try {
      await deleteTheory(theoryId);
      setTheories((current) => current.filter((theory) => theory.id !== theoryId));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileSaving(true);
    setProfileError("");
    setProfileFeedback("");

    try {
      let nextProfileImageUrl = profileForm.profileImageUrl.trim();

      if (profileImageFile) {
        const uploadedUser = await uploadProfileImage(profileImageFile);
        nextProfileImageUrl = uploadedUser.profileImageUrl ?? "";
      }

      const updated = await updateProfile({
        username: profileForm.username.trim(),
        bio: profileForm.bio.trim(),
        profileImageUrl: nextProfileImageUrl,
      });
      setProfileFeedback("Perfil actualizado.");
      setProfileImageFile(null);
      setProfilePreviewUrl("");
      setProfileForm((current) => ({
        ...current,
        profileImageUrl: updated.profileImageUrl ?? "",
      }));

      if (updated.username !== user?.username) {
        navigate("/profile", { replace: true });
      }
    } catch (requestError) {
      setProfileError(requestError.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const headingTitle = isOwnProfile ? "Mi perfil" : `Perfil de ${currentProfile?.username ?? "usuario"}`;
  const theoriesTitle = isOwnProfile ? "Mis teorias" : `Teorias de ${currentProfile?.username ?? "este autor"}`;
  const theoriesKicker = isOwnProfile ? "Perfil" : "Perfil publico";
  const editableProfilePreview = {
    ...user,
    username: profileForm.username || user?.username,
    profileImageUrl: profilePreviewUrl || profileForm.profileImageUrl || user?.profileImageUrl,
  };

  return (
    <main className="social-route-shell">
      <section className="page-stack">
        <header className="feed-masthead">
          <div className="profile-hero">
            <UserAvatar user={currentProfile} className="profile-avatar" disableLink={isOwnProfile} />
            <div className="profile-hero-copy">
              <p className="panel-kicker">{isOwnProfile ? "Mi perfil" : "Perfil publico"}</p>
              <h2>{headingTitle}</h2>
              <p className="feed-masthead-copy">
                {currentProfile?.bio?.trim()
                  ? currentProfile.bio
                  : isOwnProfile
                    ? "Configura tu presentacion publica, revisa tus teorias y ajusta tu identidad dentro de la comunidad."
                    : "Este usuario todavia no ha escrito una descripcion publica."}
              </p>
            </div>
          </div>
        </header>

        {isOwnProfile ? (
          <section className="feed-surface">
            <div className="section-head feed-section-head">
              <div>
                <p className="panel-kicker">Editar perfil</p>
                <h2>Tu contenido personal</h2>
              </div>
            </div>

            <form className="profile-edit-form" onSubmit={handleProfileSubmit}>
              <div className="profile-editor-top">
                <UserAvatar user={editableProfilePreview} className="profile-avatar" disableLink />
              </div>

              <label>
                Nombre de usuario
                <input
                  type="text"
                  value={profileForm.username}
                  onChange={(event) =>
                    setProfileForm((current) => ({ ...current, username: event.target.value }))
                  }
                  minLength="3"
                  maxLength="80"
                />
              </label>

              <label>
                Descripcion de ti
                <textarea
                  rows="4"
                  value={profileForm.bio}
                  onChange={(event) =>
                    setProfileForm((current) => ({ ...current, bio: event.target.value }))
                  }
                  placeholder="Quien eres, que te interesa debatir y que tipo de teorias publicas."
                />
              </label>

              <label>
                Foto de perfil desde tu escritorio
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={(event) => setProfileImageFile(event.target.files?.[0] ?? null)}
                />
              </label>

              <p className="profile-helper-copy">
                Puedes cambiar tu nombre, tu descripcion y tu foto desde aqui. Si eliges un archivo,
                se subira al backend y sustituira la imagen actual.
              </p>

              <div className="profile-image-actions">
                <button type="submit" className="primary-action" disabled={profileSaving}>
                  {profileSaving ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>

              {profileError ? <p className="error">{profileError}</p> : null}
              {profileFeedback ? <p className="feedback">{profileFeedback}</p> : null}
            </form>
          </section>
        ) : null}

        <TheoryList
          theories={theories}
          loading={loading}
          error={error}
          onVote={handleVote}
          onDelete={isOwnProfile ? handleDelete : undefined}
          deletingId={deletingId}
          kicker={theoriesKicker}
          title={theoriesTitle}
          emptyTitle={isOwnProfile ? "Todavia no has publicado teorias." : "Este usuario no ha publicado teorias todavia."}
          emptyCopy={isOwnProfile ? "Publica una teoria nueva para abrir tu primer debate." : "Cuando publique su primera teoria, aparecera aqui."}
        />
      </section>
    </main>
  );
}
