GIT_ROOT_PATH=$(git rev-parse --show-toplevel)
PROTO_PATH=$GIT_ROOT_PATH/scripts/proto
BACK_PROTO_PATH=$GIT_ROOT_PATH/backend/back/proto
SUPERVISOR_PROTO_PATH=$GIT_ROOT_PATH/backend/supervisor/proto

if ! [[ -d "$PROTO_PATH" ]]; then
  echo Protobuf files not found! Cloning...
  git clone git@github.com:RezaRahemtola/area-proto.git $PROTO_PATH
  find $PROTO_PATH -not -name "*proto" -exec rm -rf {} \;
fi

echo Copying protobuf files...

rm -rf $BACK_PROTO_PATH $SUPERVISOR_PROTO_PATH
rm -rf $GIT_ROOT_PATH/backend/workers/airtable/proto
rm -rf $GIT_ROOT_PATH/backend/workers/github/proto
rm -rf $GIT_ROOT_PATH/backend/workers/gitlab/proto
rm -rf $GIT_ROOT_PATH/backend/workers/google/proto
rm -rf $GIT_ROOT_PATH/backend/workers/linear/proto
rm -rf $GIT_ROOT_PATH/backend/workers/linkedin/proto
rm -rf $GIT_ROOT_PATH/backend/workers/microsoft/proto
rm -rf $GIT_ROOT_PATH/backend/workers/seconds-interval/proto
rm -rf $GIT_ROOT_PATH/backend/workers/todoist/proto
rm -rf $GIT_ROOT_PATH/backend/workers/twitter/proto
rm -rf $GIT_ROOT_PATH/backend/workers/discord/proto

cp -rf $PROTO_PATH $BACK_PROTO_PATH
cp -rf $PROTO_PATH $SUPERVISOR_PROTO_PATH
cp -rf $PROTO_PATH $GIT_ROOT_PATH/backend/workers/airtable/proto
cp -rf $PROTO_PATH $GIT_ROOT_PATH/backend/workers/github/proto
cp -rf $PROTO_PATH $GIT_ROOT_PATH/backend/workers/gitlab/proto
cp -rf $PROTO_PATH $GIT_ROOT_PATH/backend/workers/google/proto
cp -rf $PROTO_PATH $GIT_ROOT_PATH/backend/workers/linear/proto
cp -rf $PROTO_PATH $GIT_ROOT_PATH/backend/workers/linkedin/proto
cp -rf $PROTO_PATH $GIT_ROOT_PATH/backend/workers/microsoft/proto
cp -rf $PROTO_PATH $GIT_ROOT_PATH/backend/workers/seconds-interval/proto
cp -rf $PROTO_PATH $GIT_ROOT_PATH/backend/workers/todoist/proto
cp -rf $PROTO_PATH $GIT_ROOT_PATH/backend/workers/twitter/proto
cp -rf $PROTO_PATH $GIT_ROOT_PATH/backend/workers/discord/proto

echo Protobuf files copied.
