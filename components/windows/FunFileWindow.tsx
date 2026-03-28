interface FunFile {
  src: string;
  caption: string;
  meta: string;
}

const files: Record<string, FunFile> = {
  beach: {
    src: "https://picsum.photos/seed/beach99/480/300",
    caption: "beach_that_one_summer.jpg",
    meta: "Taken July 2019 • 4.2 MB • JPEG",
  },
  cat: {
    src: "https://picsum.photos/seed/fluffycat/480/300",
    caption: "my_cat_on_a_tuesday.png",
    meta: "His name is Nugget • 2.7 MB • PNG",
  },
  vibes: {
    src: "https://picsum.photos/seed/goodvibes42/480/300",
    caption: "totally_not_wallpaper.jpg",
    meta: "Found on the internet • 8.1 MB • JPEG",
  },
  fine: {
    src: "https://picsum.photos/seed/thisisfine7/480/300",
    caption: "this_is_fine.png",
    meta: "Everything is under control • 1.1 MB • PNG",
  },
};

export default function FunFileWindow({ id }: { id: string }) {
  const file = files[id];
  if (!file) return null;

  return (
    <div style={{ fontFamily: "'Courier Prime', monospace", color: "var(--text)" }}>
      <div style={{
        border: "2px solid",
        borderColor: "var(--bevel-sh) var(--bevel-hl) var(--bevel-hl) var(--bevel-sh)",
        overflow: "hidden",
        marginBottom: 10,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 200,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={file.src}
          alt={file.caption}
          style={{ width: "100%", display: "block", objectFit: "cover" }}
        />
      </div>
      <div style={{ fontSize: 13, color: "var(--text)", marginBottom: 4 }}>
        📄 {file.caption}
      </div>
      <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
        {file.meta}
      </div>
    </div>
  );
}
