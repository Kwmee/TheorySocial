import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TheoryList } from "../components/TheoryList";
import { UserAvatar } from "../components/UserAvatar";
import { useAuth } from "../hooks/useAuth";
import {
  deleteTheory,
  fetchFavoriteTheories,
  followUser,
  pinMyTheory,
  unpinMyTheory,
  unfollowUser,
  toggleFavoriteTheory,
  fetchMyTheories,
  fetchTheoriesByUsername,
  fetchUserProfile,
  uploadProfileImage,
  updateTheory,
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
  const [savedTheories, setSavedTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedLoading, setSavedLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedError, setSavedError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [favoritingId, setFavoritingId] = useState(null);
  const [profileForm, setProfileForm] = useState({
    username: user?.username ?? "",
    bio: user?.bio ?? "",
    profileImageUrl: user?.profileImageUrl ?? "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileFeedback, setProfileFeedback] = useState("");
  const [followLoading, setFollowLoading] = useState(false);
  const [pinningId, setPinningId] = useState(null);
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
      setSavedError("");
      setSavedLoading(isOwnProfile);

      try {
        const [profileData, theoryData, savedData] = await Promise.all(
          isOwnProfile
            ? [fetchUserProfile(user.username), fetchMyTheories(), fetchFavoriteTheories()]
            : [fetchUserProfile(username), fetchTheoriesByUsername(username), Promise.resolve([])],
        );

        if (!active) {
          return;
        }

        setPublicProfile(profileData);
        setTheories(theoryData.map(enrichTheory));
        setSavedTheories(savedData.map(enrichTheory));
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
          setSavedLoading(false);
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

  const currentProfile = publicProfile ?? profileUser;

  const handleVote = async (theoryId, value) => {
    const updated = enrichTheory(await voteTheory(theoryId, value));
    setTheories((current) => current.map((theory) => (theory.id === theoryId ? updated : theory)));
    return updated;
  };

  const handleFavorite = async (theoryId) => {
    setFavoritingId(theoryId);
    setSavedError("");

    try {
      const updated = enrichTheory(await toggleFavoriteTheory(theoryId));
      setTheories((current) => current.map((theory) => (theory.id === theoryId ? updated : theory)));

      if (isOwnProfile) {
        setSavedTheories((current) => {
          const exists = current.some((theory) => theory.id === theoryId);
          if (updated.bookmarked) {
            return exists
              ? current.map((theory) => (theory.id === theoryId ? updated : theory))
              : [updated, ...current];
          }

          return current.filter((theory) => theory.id !== theoryId);
        });
      }

      return updated;
    } catch (requestError) {
      setSavedError(requestError.message);
      throw requestError;
    } finally {
      setFavoritingId(null);
    }
  };

  const handleDelete = async (theoryId) => {
    setDeletingId(theoryId);
    setError("");

    try {
      await deleteTheory(theoryId);
      setTheories((current) => current.filter((theory) => theory.id !== theoryId));
      if (currentProfile?.pinnedTheory?.id === theoryId) {
        setPublicProfile((current) =>
          current
            ? {
                ...current,
                pinnedTheory: null,
              }
            : current,
        );
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateTheory = async (theoryId, payload) => {
    setUpdatingId(theoryId);
    setError("");

    try {
      const updated = enrichTheory(await updateTheory(theoryId, payload));
      setTheories((current) => current.map((theory) => (theory.id === theoryId ? updated : theory)));
      if (currentProfile?.pinnedTheory?.id === theoryId) {
        setPublicProfile((current) =>
          current
            ? {
                ...current,
                pinnedTheory: {
                  ...current.pinnedTheory,
                  title: updated.title,
                  content: updated.content,
                },
              }
            : current,
        );
      }
      return updated;
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    } finally {
      setUpdatingId(null);
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

  const handlePinTheory = async (theoryId) => {
    if (!isOwnProfile) {
      return;
    }

    setPinningId(theoryId);
    setError("");

    try {
      const updatedProfile =
        currentProfile?.pinnedTheory?.id === theoryId ? await unpinMyTheory() : await pinMyTheory(theoryId);
      setPublicProfile(updatedProfile);
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    } finally {
      setPinningId(null);
    }
  };

  const handleShareProfile = async () => {
    if (!currentProfile?.username) {
      return;
    }

    const url = `${window.location.origin}/users/${currentProfile.username}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Perfil de ${currentProfile.username}`,
          text: currentProfile.bio ?? "Descubre este perfil en Theory Social.",
          url,
        });
        setProfileFeedback("Perfil compartido.");
        return;
      }

      await navigator.clipboard.writeText(url);
      setProfileFeedback("Enlace del perfil copiado.");
    } catch {
      window.prompt("Copia este enlace de perfil", url);
      setProfileFeedback("Copia manual del perfil abierta.");
    }
  };

  const handleFollowToggle = async () => {
    if (!currentProfile || isOwnProfile) {
      return;
    }

    setFollowLoading(true);
    setError("");

    try {
      const nextProfile = currentProfile.followedByViewer
        ? await unfollowUser(currentProfile.username)
        : await followUser(currentProfile.username);
      setPublicProfile(nextProfile);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setFollowLoading(false);
    }
  };

  const headingTitle = isOwnProfile
    ? currentProfile?.username ?? user?.username ?? "Usuario"
    : `Perfil de ${currentProfile?.username ?? "usuario"}`;
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
            <div className="profile-hero-body">
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
              <div className="profile-hero-side">
                <div className="profile-metric-row">
                  <div className="profile-metric-card">
                    <strong>{currentProfile?.theoryCount ?? theories.length}</strong>
                    <span>Teorias</span>
                  </div>
                  <div className="profile-metric-card">
                    <strong>{currentProfile?.followersCount ?? 0}</strong>
                    <span>Seguidores</span>
                  </div>
                  <div className="profile-metric-card">
                    <strong>{currentProfile?.followingCount ?? 0}</strong>
                    <span>Seguidos</span>
                  </div>
                </div>
                {!isOwnProfile ? (
                  <div className="profile-public-actions">
                    <button
                      type="button"
                      className={currentProfile?.followedByViewer ? "vote-chip" : "vote-chip active-like"}
                      onClick={handleFollowToggle}
                      disabled={followLoading}
                    >
                      {followLoading
                        ? "Actualizando..."
                        : currentProfile?.followedByViewer
                          ? "Siguiendo"
                          : "Seguir"}
                    </button>
                    <button type="button" className="vote-chip" onClick={handleShareProfile}>
                      Compartir perfil
                    </button>
                  </div>
                ) : (
                  <div className="profile-public-actions">
                    <button type="button" className="vote-chip" onClick={handleShareProfile}>
                      Compartir perfil
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {currentProfile?.pinnedTheory ? (
          <section className="feed-surface profile-highlight-card">
            <div className="section-head feed-section-head">
              <div>
                <p className="panel-kicker">Destacada</p>
                <h2>Teoria fija del perfil</h2>
              </div>
              {isOwnProfile ? (
                <button type="button" className="vote-chip" onClick={() => handlePinTheory(currentProfile.pinnedTheory.id)}>
                  Quitar destacada
                </button>
              ) : null}
            </div>
            <div className="profile-highlight-copy">
              <h3>{currentProfile.pinnedTheory.title}</h3>
              <p>{currentProfile.pinnedTheory.content}</p>
            </div>
          </section>
        ) : null}

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

        {isOwnProfile ? (
          <TheoryList
            theories={savedTheories}
            loading={savedLoading}
            error={savedError}
            onVote={handleVote}
            onFavorite={handleFavorite}
            favoritingId={favoritingId}
            kicker="Mi perfil"
            title="Guardados"
            emptyTitle="No has guardado teorias todavia."
            emptyCopy="Cuando pulses Guardar en una teoria, aparecera aqui dentro de tu perfil."
            compact
          />
        ) : null}

        <TheoryList
          theories={theories}
          loading={loading}
          error={error}
          onVote={handleVote}
          onFavorite={handleFavorite}
          favoritingId={favoritingId}
          onDelete={isOwnProfile ? handleDelete : undefined}
          onUpdate={isOwnProfile ? handleUpdateTheory : undefined}
          onPin={isOwnProfile ? handlePinTheory : undefined}
          deletingId={deletingId}
          pinningId={pinningId}
          pinnedTheoryId={currentProfile?.pinnedTheory?.id ?? null}
          updatingId={updatingId}
          kicker={theoriesKicker}
          title={theoriesTitle}
          emptyTitle={isOwnProfile ? "Todavia no has publicado teorias." : "Este usuario no ha publicado teorias todavia."}
          emptyCopy={isOwnProfile ? "Publica una teoria nueva para abrir tu primer debate." : "Cuando publique su primera teoria, aparecera aqui."}
        />
      </section>
    </main>
  );
}
