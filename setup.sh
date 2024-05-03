#!/bin/sh

normal=$1
lower=$2
upper=$3

mv abcd-engine $lower-engine
mv abcd-ui $lower-ui
mv abcd-app-interface/assets/abcd abcd-app-interface/assets/$normal
mv abcd-app-interface $lower-app-interface

edit () {
    echo $1 $2 $3
    sed -i '' -e "s/Abcd/$normal/g" -e "s/abcd/$lower/g" -e "s/ABCD/$upper/g" "$file"
    mv $file $(echo $file | sed -e "s/Abcd/$normal/g" -e "s/abcd/$lower/g" -e "s/ABCD/$upper/g" )
    echo $file

}

file=".gitignore"
edit

for file in $(find . -name "*.ts")
do
    edit
done

for file in $(find . -name "*.tsx")
do
    edit
done

for file in $(find . -name "*.json")
do
    edit
done

for file in $(find . -name "*.yml")
do
    edit
done
