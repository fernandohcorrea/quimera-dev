FROM mariadb:10.3.36

ARG DK_UID=1000

ARG DK_GID=1000

RUN usermod -u ${DK_UID:-1000} mysql && \
    groupmod -g ${DK_GID:-1000} mysql

COPY etc/mysql/my.cnf /etc/mysql/my.cnf

USER mysql