PACKAGE=.
REMOTEDIR=/var/www/www_ethereum_org/public_html/
KEYPATH=~/Downloads/prod-web.pem
SERVERS=(54.213.131.123 54.213.131.108)

for ix in ${!SERVERS[*]}
do
    printf "......................\nConnecting to %s...\n" "${SERVERS[$ix]}"
    rsync -avzl -e "ssh -i ${KEYPATH}" --exclude ".git" ${PACKAGE} ubuntu@${SERVERS[$ix]}:${REMOTEDIR}
done
