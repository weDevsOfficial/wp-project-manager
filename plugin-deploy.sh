#!/bin/bash

# args
MSG=${1-'deploy from git'}
MAINFILE="cpm.php" # for version checking

# paths
SRC_DIR=$(git rev-parse --show-toplevel)
DIR_NAME=$(basename $SRC_DIR)
DEST_DIR=~/Development/svn/wp-plugins/$DIR_NAME
TRUNK="$DEST_DIR/trunk"

# make sure we're deploying from the right dir
if [ ! -d "$SRC_DIR/.git" ]; then
    echo "$SRC_DIR doesn't seem to be a git repository"
    exit
fi

# check version in readme.txt is the same as plugin file
READMEVERSION=`grep "Stable tag" $SRC_DIR/readme.txt | awk '{ print $NF}'`
PLUGINVERSION=`grep "Version" $SRC_DIR/$MAINFILE | awk '{ print $NF}'`

echo ".........................................."
echo
echo "Preparing to deploy WP Project Manager"
echo "(Current version: $PLUGINVERSION)"
echo
echo ".........................................."
echo


if [ "$READMEVERSION" != "$PLUGINVERSION" ]; then
    echo "Versions don't match. Exiting....";
    exit 1
fi

# make sure the destination dir exists
svn mkdir $TRUNK 2> /dev/null
svn add $TRUNK 2> /dev/null

# delete everything except .svn dirs
for file in $(find $TRUNK/* -not -path "*.svn*")
do
    svn rm -rf $file 2>/dev/null
    echo $file
done

# copy everything over from git
echo "Copying everything over from git..."
#rsync -r --exclude='*.git*' $SRC_DIR/* $TRUNK
git checkout-index -a -f --prefix=$TRUNK/
# copy the vendor folder
rsync -r $SRC_DIR/vendor $TRUNK/

# delete readme.md from git checkout
rm $TRUNK/readme.md

# copy readme.txt to svn folder
cp $SRC_DIR/readme.txt $TRUNK/readme.txt


cd $DEST_DIR

# check .svnignore
echo "Removing svnignored files..."
for file in $(cat "$SRC_DIR/.svnignore" 2>/dev/null)
do
    rm -rf trunk/$file
done

# Transform the readme
#README=$(find $TRUNK -iname 'README.m*')
#sed -i '' -e 's/^# \(.*\)$/=== \1 ===/' -e 's/ #* ===$/ ===/' -e 's/^## \(.*\)$/== \1 ==/' -e 's/ #* ==$/ ==/' -e 's/^### \(.*\)$/= \1 =/' -e 's/ #* =$/ =/' $README

#mv $README $TRUNK/readme.txt

# svn addremove
svn stat | grep '^\?' | awk '{print $2}' | xargs svn add > /dev/null 2>&1
svn stat | grep '^\!' | awk '{print $2}' | xargs svn rm  > /dev/null 2>&1

echo "Copying trunk to tag..."
svn copy trunk/ tags/$READMEVERSION/

svn stat

svn ci -m "$MSG"
