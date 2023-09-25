echo Copying protobuf files...

GIT_ROOT_PATH=$(git rev-parse --show-toplevel)
PROTO_PATH=$GIT_ROOT_PATH/tools/proto
BACK_PROTO_PATH=$GIT_ROOT_PATH/backend/back/proto
SUPERVISOR_PROTO_PATH=$GIT_ROOT_PATH/backend/supervisor/proto

rm -r $BACK_PROTO_PATH $SUPERVISOR_PROTO_PATH
rm -r $GIT_ROOT_PATH/backend/workers/seconds-interval/proto

cp -r $PROTO_PATH $BACK_PROTO_PATH
cp -r $PROTO_PATH $SUPERVISOR_PROTO_PATH
cp -r $PROTO_PATH $GIT_ROOT_PATH/backend/workers/seconds-interval/proto

echo Protobuf files copied.
