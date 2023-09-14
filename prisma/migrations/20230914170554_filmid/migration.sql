-- CreateTable
CREATE TABLE "Users" (
    "userid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "profile" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "subscription" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "userid" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movie" (
    "filmid" SERIAL NOT NULL,
    "views" INTEGER,
    "releasedate" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "film" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("filmid")
);

-- CreateTable
CREATE TABLE "Director" (
    "dirid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,

    CONSTRAINT "Director_pkey" PRIMARY KEY ("dirid")
);

-- CreateTable
CREATE TABLE "DirectorData" (
    "id" SERIAL NOT NULL,
    "filmid" INTEGER NOT NULL,
    "dirid" INTEGER NOT NULL,

    CONSTRAINT "DirectorData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MovieDirectors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MovieDirectors_AB_unique" ON "_MovieDirectors"("A", "B");

-- CreateIndex
CREATE INDEX "_MovieDirectors_B_index" ON "_MovieDirectors"("B");

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userid_fkey" FOREIGN KEY ("userid") REFERENCES "Users"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectorData" ADD CONSTRAINT "DirectorData_filmid_fkey" FOREIGN KEY ("filmid") REFERENCES "Movie"("filmid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectorData" ADD CONSTRAINT "DirectorData_dirid_fkey" FOREIGN KEY ("dirid") REFERENCES "Director"("dirid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieDirectors" ADD CONSTRAINT "_MovieDirectors_A_fkey" FOREIGN KEY ("A") REFERENCES "Director"("dirid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieDirectors" ADD CONSTRAINT "_MovieDirectors_B_fkey" FOREIGN KEY ("B") REFERENCES "Movie"("filmid") ON DELETE CASCADE ON UPDATE CASCADE;
