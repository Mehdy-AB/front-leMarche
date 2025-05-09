type UserAvatarProps = {
  userName: string;
  height: number; // in pixels
};

export const UserAvatar = ({ userName, height }: UserAvatarProps) => {
  function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 60%)`;
  }

  const bgColor = stringToColor(userName);
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="flex items-center justify-center font-bold text-white mx-auto"
      style={{
        width: height,
        height: height,
        borderRadius: height / 2,
        backgroundColor: bgColor,
        fontSize: height * 0.4, // adjust based on your design
      }}
    >
      {initials}
    </div>
  );
};
