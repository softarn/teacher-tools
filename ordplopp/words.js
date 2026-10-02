// Vanliga svenska ord. Grupperas automatiskt efter längd (2–9 bokstäver) i app.js.
const WORDS = `
är en på av de du vi ni om så nu ut in ja ge ta gå se bo ko sy le ny åt än ål is ek ro få bi ur då ha jo nå må

och att det som jag han hon men för med var den har kan ska vad hur när mor far bil båt hus sol hav sjö ost mus
ägg öra arm ben mun öga hår sko mat äta tre två sex sju tio röd blå gul vit sur arg fin ful kul rik tom het lök
ris bok kök rum dag jul vår bär räv älg örn orm gås får get apa säl val haj löv tak golv mål dörr glas
väg lek sal kam tåg buss

hund katt gris häst fisk bord stol säng boll skog berg stad hand näsa mage tand kind hals glad stor lila rosa
grön bröd smör korv kaka vara göra leka läsa sova varg myra ödla höna tupp anka lamm kalv valp träd gräs sten
bror rädd läxa sand snö regn vind moln måne mjöl ljus mörk varm kall sval lugn tyst fort långt söt bild
penna sudd kort brev namn spel film sång dans

fågel lampa docka liten svart mjölk glass äpple päron hoppa titta pappa mamma kusin bebis någon målar ritar
läser lejon tiger björn uggla humla mygga groda padda ponny zebra kamel manet trött snäll modig busig mössa
tröja byxor kudde täcke soffa hemma pinne kotte svamp pulka kälke godis blomma skola fiska bada simma sjuka
klocka

vatten dricka fjäril ekorre blåbär lingon hallon måndag tisdag onsdag fredag lördag söndag kompis vänner mormor
morfar farmor farfar syster kanske alltid aldrig hoppar simmar cyklar dansar pratar frågar svarar tänker kommer
gjorde ledsen vantar spegel skolan doktor geting snigel krabba delfin giraff helgen kärlek skidor
sommar vinter hösten regnet

springa plommon potatis tomater pingvin traktor lastbil torsdag januari oktober svenska förstår började tittade
sjunger skriver lyssnar hungrig törstig halsduk stövlar skjorta kylskåp affären polisen spindel hamster
marsvin isbjörn choklad kvällen utflykt äventyr vänskap frukost smörgås fönster tidning vintern

flygplan glasögon jordgubb trädgård kompisar klassrum skolgård matsalen krokodil igelkott pannkaka morötter
snögubbe julafton stjärnor sandlåda gungorna brandbil polisbil februari november december engelska historia
teckning familjen eftersom berättar springer skrattar strumpor klänning stranden badhuset lekplats kyckling
papegoja flodhäst middagen morgonen semester istappar

september matematik gymnastik jordgubbe regnbåge presenter ballonger midsommar fotbollen skridskor sommarlov
regnjacka sjukhuset bläckfisk elefanter papegojor pingviner kattungar spännande ingenting någonting lärarinna
pannkakor smörgåsar frukosten berättade skrattade hemlighet äventyret kastanjer blommorna maskrosor snöflinga
snöbollar
`.trim().split(/\s+/);
