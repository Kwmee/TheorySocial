import { Link } from "react-router-dom";
import { resolveAssetUrl } from "../services/api";

export function UserAvatar({ user, className = "", fallback = "U", disableLink = false }) {
  const initial = user?.username?.slice(0, 1).toUpperCase() ?? fallback;
  const imageUrl = resolveAssetUrl(user?.profileImageUrl?.trim());
  const avatarClassName = `author-avatar ${imageUrl ? "avatar-image-shell" : ""} ${className}`.trim();

  const avatar = imageUrl ? (
    <div className={avatarClassName}>
      <img src={imageUrl} alt={`Avatar de ${user?.username ?? "usuario"}`} className="avatar-image" />
    </div>
  ) : (
    <div className={avatarClassName}>{initial}</div>
  );

  if (disableLink || !user?.username) {
    return avatar;
  }

  return (
    <Link
      to={`/users/${encodeURIComponent(user.username)}`}
      className="avatar-link"
      aria-label={`Ver perfil de ${user.username}`}
      title={`Ver perfil de ${user.username}`}
    >
      {avatar}
    </Link>
  );
}
