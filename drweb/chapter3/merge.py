import os

# Settings
output_file = "game.unx"
part_prefix = "game.unx.part"

def merge_parts(output, prefix):
    part_num = 1
    with open(output, "wb") as out:
        while True:
            part_name = f"{prefix}{part_num}"
            if not os.path.exists(part_name):
                break
            with open(part_name, "rb") as part:
                data = part.read()
                out.write(data)
                print(f"Merged {part_name} ({len(data)} bytes)")
            part_num += 1
    print(f"✅ Merging complete: {output}")

if __name__ == "__main__":
    merge_parts(output_file, part_prefix)
