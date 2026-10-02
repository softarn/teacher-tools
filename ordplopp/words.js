// Ordlista för Ordplopp. Orden grupperas automatiskt efter längd (2–9 bokstäver) i app.js,
// så ordningen här spelar ingen roll.
//
// Urval:
// - Högfrekventa småord (inte, till, här, också …) – de viktigaste att automatisera.
// - Konkreta, vardagliga ord som barn i lågstadiet känner igen.
// - Inga ord som riskerar fnitter eller obehag på storbild, inga ålderdomliga ord.
const WORDS = `
är en på av de du vi ni om så nu ut in ja ge ta gå se än då ha sa jo få bo ko tå fe is ek bi ål sy le ro ny åt ur hö

och att det som jag han hon men för med var den har kan ska vad hur när här där ett man upp ner hem sin sig mig
dig oss kom gör ser nej ute tre två fem sju nio tio
mor far bil båt hus sol hav sjö ost mus ägg öra arm ben mun öga hår sko mat äta röd blå gul vit sur arg fin ful kul
tom het lök ris bok kök rum dag jul vår bär räv älg örn orm gås får get apa säl val haj löv tak väg lek tåg kam sax
snö söt

inte till från vill bara alla hade blev gick sitt mitt ditt inne äter fyra åtta elva vara göra leka läsa sova
hund katt gris häst fisk bord stol säng boll skog berg stad hand näsa mage tand kind hals glad stor lila rosa grön
bröd smör korv kaka varg myra ödla höna tupp anka lamm kalv valp träd gräs sten bror rädd läxa sand regn vind moln
måne mjöl ljus mörk varm kall lugn tyst fort bild sudd kort brev namn spel film sång dans golv dörr glas buss

också efter under säger några något någon sedan långt fågel lampa docka liten svart mjölk glass äpple päron hoppa
titta pappa mamma kusin bebis målar ritar läser lejon tiger björn uggla humla mygga groda padda ponny zebra kamel
manet trött snäll modig busig mössa tröja byxor kudde täcke soffa hemma pinne kotte svamp pulka kälke godis skola
fiska simma kanin penna tårta polis

skulle mycket kanske alltid aldrig kommer gjorde sitter tittar lärare blomma klocka vatten dricka fjäril ekorre
blåbär lingon hallon måndag tisdag onsdag fredag lördag söndag kompis vänner mormor morfar farmor farfar syster
hoppar simmar cyklar dansar pratar frågar svarar tänker ledsen vantar spegel skolan doktor geting snigel krabba
delfin giraff helgen kärlek skidor sommar vinter hösten regnet familj

springa plommon potatis tomater pingvin traktor lastbil torsdag januari oktober svenska förstår började tittade
sjunger skriver lyssnar hungrig törstig halsduk stövlar skjorta kylskåp affären spindel hamster marsvin isbjörn
choklad utflykt äventyr vänskap frukost smörgås fönster elefant

tillbaka flygplan glasögon trädgård kompisar klassrum skolgård matsalen krokodil igelkott pannkaka morötter
snögubbe julafton stjärnor sandlåda trädkoja brandbil polisbil februari november december engelska historia
teckning leksaker eftersom berättar springer skrattar strumpor klänning stranden badhuset lekplats kyckling
papegoja flodhäst semester istappar tandkräm

september matematik gymnastik jordgubbe regnbåge presenter ballonger midsommar skridskor sommarlov regnjacka
bläckfisk elefanter papegojor pingviner kattungar spännande ingenting någonting pannkakor smörgåsar berättade
skrattade hemlighet kastanjer maskrosor snöflinga snöbollar skolväska matsäcken flygplats jultomten julgranen
trampolin sandslott mellanmål fotbollen
`.trim().split(/\s+/);
