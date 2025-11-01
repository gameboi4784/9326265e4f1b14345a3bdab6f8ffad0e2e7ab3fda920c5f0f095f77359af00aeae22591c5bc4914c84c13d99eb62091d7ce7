chunk_size = 19 * 1024 * 1024  # 19 MB
with open("game.unx", "rb") as f:
    i = 1
    while chunk := f.read(chunk_size):
        with open(f"game.unx.part{i}", "wb") as out:
            out.write(chunk)
        i += 1
