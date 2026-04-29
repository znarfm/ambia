#!/bin/bash

# Ensure models directory exists
mkdir -p public/models

echo "Downloading face-api.js models..."

BASE_URL="https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

# Models required for tiny_face_detector and face_expression
MODELS=(
  "tiny_face_detector_model-weights_manifest.json"
  "tiny_face_detector_model-shard1"
  "face_expression_model-weights_manifest.json"
  "face_expression_model-shard1"
)

for MODEL in "${MODELS[@]}"; do
  if [ ! -f "public/models/$MODEL" ]; then
    echo "Fetching $MODEL..."
    curl -s -L "$BASE_URL/$MODEL" -o "public/models/$MODEL"
  else
    echo "$MODEL already exists."
  fi
done

echo "Models downloaded successfully."
