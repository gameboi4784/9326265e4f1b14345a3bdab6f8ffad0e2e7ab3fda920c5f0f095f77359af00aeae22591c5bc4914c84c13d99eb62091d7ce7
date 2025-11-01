import os

# Settings
input_file = "game.unx"
chunk_size = 19 * 1024 * 1024  # 19 MB

def split_file(filename, size):
    with open(filename, "rb") as f:
        part = 1
        while True:
            chunk = f.read(size)
            if not chunk:
                break
            part_filename = f"{filename}.part{part}"
            with open(part_filename, "wb") as out:
                out.write(chunk)
            print(f"Created {part_filename} ({len(chunk)} bytes)")
            part += 1

if __name__ == "__main__":
    if not os.path.exists(input_file):
        print(f"File not found: {input_file}")
    else:
        split_file(input_file, chunk_size)
