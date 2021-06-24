set -e

tp_folder="node_modules"

if [ ! -d $tp_folder ]; then
    echo $tp_folder" is not found..."
    echo "installing..."
  npm install
fi

echo "packing..."
npm run build

rm -rf ./release/innoAgent-dashboard
cp -f -R "./dist" "./release/innoAgent-dashboard" 
echo "done!"
