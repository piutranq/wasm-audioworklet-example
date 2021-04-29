#!/bin/sh

printf "Build the ./crate to wasm\n\n"
cargo build\
  --release\
  --target wasm32-unknown-unknown\
  --manifest-path ./crate/Cargo.toml

mkdir -p www/wasm
cp crate/target/wasm32-unknown-unknown/release/soundchip.wasm www/wasm/soundchip.wasm
printf "\n"

printf "Bundle the ./src into www/js\n\n"
npx webpack
printf "\n"
