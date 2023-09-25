echo Copying protobuf files...

cp -r proto/ ../backend/back/proto/
cp -r proto/ ../backend/supervisor/proto/
cp -r proto/ ../backend/workers/seconds-interval/proto

echo Protobuf files copied.