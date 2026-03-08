package com.theory.backend;

import com.theory.backend.model.Theory;
import com.theory.backend.model.TheoryVote;
import com.theory.backend.model.User;
import com.theory.backend.repository.TheoryRepository;
import com.theory.backend.repository.TheoryVoteRepository;
import com.theory.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@SpringBootTest(
        properties = {
                "spring.datasource.url=jdbc:mysql://localhost:3306/theory_social?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC",
                "spring.datasource.username=theory_user",
                "spring.datasource.password=Zv50)ju3KCSb9NA6",
                "spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver",
                "spring.jpa.hibernate.ddl-auto=update",
                "spring.jpa.show-sql=false",
                "spring.jpa.open-in-view=false"
        }
)
@EnabledIfSystemProperty(named = "seed.real.data", matches = "true")
class SeedRealisticDataTest {

    private static final String DEMO_PASSWORD = "TheoryDemo2026!";

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TheoryRepository theoryRepository;

    @Autowired
    private TheoryVoteRepository theoryVoteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void seedRealisticUsersTheoriesAndVotes() {
        cleanupVotesAndFakeTheories();
        cleanupSeedUsers();

        Map<String, User> users = createUsers();
        createTheoriesAndVotes(users);
    }

    private void cleanupVotesAndFakeTheories() {
        jdbcTemplate.update("""
                DELETE tv
                FROM theory_votes tv
                INNER JOIN theories t ON t.id = tv.theory_id
                WHERE LOWER(t.title) REGEXP '(^test|^prueba|^demo|lorem|fake|asdf|qwerty|teoria [0-9]+)'
                   OR LOWER(t.content) REGEXP '(^test|^prueba|^demo|lorem ipsum|contenido de prueba|texto de prueba|fake|asdf|qwerty)'
                """);

        jdbcTemplate.update("""
                DELETE FROM theories
                WHERE LOWER(title) REGEXP '(^test|^prueba|^demo|lorem|fake|asdf|qwerty|teoria [0-9]+)'
                   OR LOWER(content) REGEXP '(^test|^prueba|^demo|lorem ipsum|contenido de prueba|texto de prueba|fake|asdf|qwerty)'
                """);
    }

    private void cleanupSeedUsers() {
        jdbcTemplate.update("""
                DELETE tv
                FROM theory_votes tv
                INNER JOIN users u ON u.id = tv.user_id
                WHERE u.username IN ('ivan', 'lucia', 'marcos', 'nora', 'sergio', 'clara', 'david', 'ines', 'paula', 'alex')
                """);

        jdbcTemplate.update("""
                DELETE tv
                FROM theory_votes tv
                INNER JOIN theories t ON t.id = tv.theory_id
                INNER JOIN users u ON u.id = t.author_id
                WHERE u.username IN ('ivan', 'lucia', 'marcos', 'nora', 'sergio', 'clara', 'david', 'ines', 'paula', 'alex')
                """);

        jdbcTemplate.update("""
                DELETE t
                FROM theories t
                INNER JOIN users u ON u.id = t.author_id
                WHERE u.username IN ('ivan', 'lucia', 'marcos', 'nora', 'sergio', 'clara', 'david', 'ines', 'paula', 'alex')
                """);

        jdbcTemplate.update("""
                DELETE FROM users
                WHERE username IN ('ivan', 'lucia', 'marcos', 'nora', 'sergio', 'clara', 'david', 'ines', 'paula', 'alex')
                """);
    }

    private Map<String, User> createUsers() {
        Map<String, User> users = new LinkedHashMap<>();

        users.put("ivan", saveUser("ivan", "ivan@teoriashumanas.local", true, true, 45));
        users.put("lucia", saveUser("lucia", "lucia@teoriashumanas.local", true, true, 21));
        users.put("marcos", saveUser("marcos", "marcos@teoriashumanas.local", true, true, 18));
        users.put("nora", saveUser("nora", "nora@teoriashumanas.local", true, false, 12));
        users.put("sergio", saveUser("sergio", "sergio@teoriashumanas.local", true, true, 9));
        users.put("clara", saveUser("clara", "clara@teoriashumanas.local", true, false, 7));
        users.put("david", saveUser("david", "david@teoriashumanas.local", true, true, 6));
        users.put("ines", saveUser("ines", "ines@teoriashumanas.local", true, true, 5));
        users.put("paula", saveUser("paula", "paula@teoriashumanas.local", true, true, 4));
        users.put("alex", saveUser("alex", "alex@teoriashumanas.local", true, false, 3));

        return users;
    }

    private User saveUser(String username, String email, boolean acceptedTerms, boolean tutorialSeen, int daysAgo) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(DEMO_PASSWORD));
        user.setAcceptedTerms(acceptedTerms);
        user.setSwipeTutorialSeen(tutorialSeen);
        user.setCreatedAt(LocalDateTime.now().minusDays(daysAgo));
        return userRepository.save(user);
    }

    private void createTheoriesAndVotes(Map<String, User> users) {
        User ivan = users.get("ivan");
        User lucia = users.get("lucia");
        User marcos = users.get("marcos");
        User nora = users.get("nora");
        User sergio = users.get("sergio");
        User clara = users.get("clara");
        User david = users.get("david");
        User ines = users.get("ines");
        User paula = users.get("paula");
        User alex = users.get("alex");

        seedTheory(
                ivan,
                "La memoria emocional cambia el orden de nuestros recuerdos",
                """
                Creo que no recordamos los eventos por orden cronologico, sino por el peso emocional que nos dejaron.
                Cuando una experiencia nos mueve mucho, se convierte en una especie de ancla y reorganiza el resto de recuerdos alrededor.
                """,
                2,
                List.of(lucia, marcos, nora, sergio, clara, david, ines, paula),
                List.of(alex)
        );

        seedTheory(
                lucia,
                "Las ciudades caminan al ritmo del transporte publico",
                """
                En muchos barrios, la sensacion de seguridad o de oportunidades cambia segun la frecuencia del transporte.
                No es solo movilidad: es animo colectivo, puntualidad compartida y hasta la forma de relacionarnos.
                """,
                3,
                List.of(ivan, marcos, nora, sergio, clara, david, paula),
                List.of(alex, ines)
        );

        seedTheory(
                marcos,
                "El teletrabajo reduce conversaciones utiles que nadie agenda",
                """
                Las mejores ideas del trabajo suelen salir en momentos informales: una duda rapida, un comentario suelto o una coincidencia en un pasillo.
                Cuando todo se vuelve reunion formal, se pierde ese espacio de ajuste fino.
                """,
                1,
                List.of(ivan, lucia, nora, sergio, clara, david),
                List.of(alex)
        );

        seedTheory(
                nora,
                "Dormir mal dos noches seguidas altera mas el humor que una mala noticia",
                """
                Tengo la impresion de que una persona cansada interpreta peor casi cualquier situacion.
                Muchas discusiones no nacen de estar en desacuerdo, sino de llegar agotados a una conversacion normal.
                """,
                4,
                List.of(ivan, lucia, marcos, sergio, clara, david, ines, paula, alex),
                List.of()
        );

        seedTheory(
                sergio,
                "La gente confia mas en quien duda que en quien responde demasiado rapido",
                """
                Una respuesta inmediata puede sonar segura, pero tambien cerrada.
                Cuando alguien se toma un segundo, ordena lo que piensa y reconoce matices, suele transmitir mas confianza.
                """,
                5,
                List.of(ivan, lucia, marcos, nora, clara, david, ines, paula),
                List.of(alex)
        );

        seedTheory(
                clara,
                "El algoritmo personal de cada uno es su circulo cercano",
                """
                Antes de las redes ya viviamos filtrados por las personas de alrededor.
                Amigos, familia y companeros amplifican ciertas ideas y apagan otras, igual que una plataforma.
                """,
                1,
                List.of(ivan, lucia, marcos, paula),
                List.of(david, alex)
        );

        seedTheory(
                david,
                "Los barrios con mas panaderias parecen tener menos prisa",
                """
                No hablo de causalidad exacta, sino de atmosfera.
                Cuando un barrio conserva pequeños rituales de compra diaria, la calle se siente menos agresiva y mas conversable.
                """,
                6,
                List.of(ivan, lucia, marcos, nora, sergio, clara, ines, paula, alex),
                List.of()
        );

        seedTheory(
                ines,
                "Escuchar notas de voz hace que perdonemos mejor los conflictos",
                """
                El tono de voz devuelve humanidad a mensajes que en texto pueden sonar frios o agresivos.
                Muchas discusiones escalan porque leemos intenciones duras donde solo habia prisa.
                """,
                6,
                List.of(ivan, lucia, marcos, nora, sergio, clara, david),
                List.of()
        );

        seedTheory(
                paula,
                "Compartir memes cumple hoy la funcion de las bromas privadas antiguas",
                """
                Un meme no solo da risa: tambien marca complicidad.
                Es una forma rapida de decir te conozco, esto te representa y sigo pensando en ti aunque no te escriba mucho.
                """,
                0,
                List.of(ivan, lucia, alex),
                List.of(marcos, sergio, clara)
        );

        seedTheory(
                alex,
                "La productividad de una casa depende del sitio donde dejas el cargador",
                """
                Parece absurdo, pero el punto donde descansan el movil y el portatil ordena media rutina diaria.
                Si cargar un dispositivo es incomodo, todo el dia se descoordina un poco.
                """,
                8,
                List.of(ivan, lucia, marcos, nora, sergio, clara, david, ines, paula),
                List.of()
        );

        List<User> roster = List.of(ivan, lucia, marcos, nora, sergio, clara, david, ines, paula, alex);
        List<TheorySeed> extraSeeds = List.of(
                seed(ivan, "Hablar bajito hace que una discusion dure menos", "Cuando alguien baja el tono de voz, obliga a la otra persona a acercarse a la idea y no al conflicto. Muchas peleas se alimentan del volumen y no del contenido.", 1),
                seed(lucia, "Los grupos de amigos se reorganizan alrededor del que propone planes", "No siempre lidera quien mas habla, sino quien convierte una idea difusa en una hora y un lugar. Esa capacidad cambia la jerarquia del grupo.", 2),
                seed(marcos, "Una cocina ordenada mejora la puntualidad de toda la casa", "El desayuno es una decision pequeña que condiciona el resto de la manana. Si todo esta visible y al alcance, se reduce el caos en cadena.", 3),
                seed(nora, "Las personas recuerdan mejor los consejos que llegan tarde", "Un consejo util rara vez se reconoce en el momento. La comprension real aparece cuando uno ya ha vivido el error y puede reinterpretar la frase.", 4),
                seed(sergio, "El humor en una oficina depende de la primera reunion del dia", "La primera interaccion colectiva fija un tono. Si arranca tensa o confusa, el resto de conversaciones heredan parte de esa energia.", 5),
                seed(clara, "Elegimos cafeterias por la posibilidad de quedarnos mas que por el cafe", "Muchas veces importa menos la bebida que la sensacion de permiso para alargar una conversacion, abrir el portatil o simplemente no tener prisa.", 6),
                seed(david, "La gente mayor usa mejor los silencios en una conversacion", "No intentan llenar cada hueco. Eso hace que la charla sea menos competitiva y que las respuestas parezcan mas pensadas.", 7),
                seed(ines, "Los mensajes con faltas pequenas parecen mas humanos", "Un texto demasiado perfecto puede sonar automatico o frio. Un pequeno error a veces transmite presencia real y menos distancia.", 8),
                seed(paula, "Los domingos por la tarde son una red social emocional", "Ese tramo de horas concentra balance, comparacion y anticipacion. Por eso muchas personas sienten mas claramente si estan satisfechas o no con su semana.", 2),
                seed(alex, "Una mochila desordenada revela el tipo de dia que espera alguien", "Hay mochilas preparadas para improvisar y mochilas montadas para sobrevivir a un calendario roto. El contenido dice mucho del ritmo mental.", 3),
                seed(ivan, "Los barrios cambian de caracter cuando desaparecen los kioscos", "El kiosco era un punto de roce minimo entre desconocidos. Su perdida hace la calle mas funcional, pero menos conversable.", 4),
                seed(lucia, "Leer noticias en el movil aumenta la sensacion de urgencia", "La pantalla pequena comprime contexto y prioriza impacto. Lo importante parece inmediato aunque no lo sea realmente.", 5),
                seed(marcos, "Compartir piso ensena antes negociacion que convivencia", "La convivencia funciona cuando se acuerdan limites claros. Antes de la amistad aparece la necesidad de coordinar habitos.", 6),
                seed(nora, "La musica repetida crea refugios mentales mas que gustos", "A veces no repetimos una cancion porque sea la mejor, sino porque nos devuelve a una version concreta de nosotros mismos.", 7),
                seed(sergio, "Un jefe que escribe poco reduce el ruido de un equipo", "Los equipos se saturan no solo por tareas, tambien por mensajes ambiguos. La claridad y la brevedad son una forma de cuidado.", 8),
                seed(clara, "Las mesas redondas hacen que la gente interrumpa menos", "Cuando nadie domina visualmente el espacio, la conversacion tiende a repartirse de manera mas organica.", 9),
                seed(david, "La lluvia ligera mejora mas el humor que el sol excesivo", "No por tristeza, sino porque reduce la exigencia social de salir, rendir o aprovechar el dia de una manera concreta.", 1),
                seed(ines, "Tener plantas en casa cambia la forma de medir el tiempo", "El cuidado de algo vivo introduce una rutina mas lenta y menos productivista. Eso modifica la percepcion del dia.", 2),
                seed(paula, "El prestigio de un restaurante empieza en el ruido de la sala", "Si apenas puedes conversar, la experiencia se vuelve mas fotografiable que disfrutable. El sonido tambien es servicio.", 3),
                seed(alex, "La gente revisa el telefono mas por transicion que por interes", "Miramos el movil al terminar una tarea, al entrar en un ascensor o al esperar. Funciona como puente entre momentos.", 4),
                seed(ivan, "Los libros prestados se devuelven menos por olvido que por afecto", "Algunos objetos se quedan porque pasan a representar el vinculo con quien los presto. Devolverlos parece cerrar algo.", 5),
                seed(lucia, "La puntualidad mejora cuando los planes tienen una primera accion clara", "No es lo mismo quedar a una hora que quedar para entrar juntos, pedir algo o empezar una ruta. La accion concreta ordena mejor.", 6),
                seed(marcos, "Aprender a cocinar cambia mas la autoestima que el fisico", "Dominar una comida sencilla genera una sensacion de autonomia que se nota mucho mas alla de la dieta.", 7),
                seed(nora, "Las amistades fuertes toleran mejor los mensajes sin respuesta", "Cuando hay confianza, el silencio deja de interpretarse como rechazo automatico y se vuelve simplemente ritmo vital.", 8),
                seed(sergio, "Las colas cortas hacen que la gente sea mas impaciente", "Cuando parece que falta poco, cualquier retraso pequeño se vive como una interrupcion personal, no como parte del proceso.", 9),
                seed(clara, "Dormir con la persiana un poco abierta mejora el despertar", "La entrada gradual de luz reduce la violencia del despertador y cambia el humor de los primeros minutos.", 1),
                seed(david, "Los podcasts sustituyen a muchas conversaciones de acompanamiento", "No reemplazan amigos, pero ocupan parte del espacio emocional del trayecto, la limpieza o la espera.", 2),
                seed(ines, "El cafe compartido sirve mas para sincronizar ritmos que para hablar", "Hay encuentros donde casi no se conversa, pero salir con alguien a por un cafe ya alinea energia y horarios.", 3),
                seed(paula, "Las casas con pasillo largo favorecen mas la intimidad", "No por metros, sino porque introducen transiciones. No se entra del todo en una estancia sin pasar primero por un margen.", 4),
                seed(alex, "Quien recuerda nombres suele recordar tambien contextos emocionales", "El nombre no va solo; se engancha a una escena, a una sensacion o a un rasgo que hizo memorable ese encuentro.", 5),
                seed(ivan, "Las terrazas llenas cambian la percepcion de seguridad urbana", "Ver gente quieta, charlando y ocupando la calle hace que ciertos lugares parezcan mas habitables incluso sin mas vigilancia.", 6),
                seed(lucia, "Un buen formulario transmite respeto antes que eficiencia", "Cuando un proceso esta claro y pide solo lo necesario, la persona siente que su tiempo se ha tenido en cuenta.", 7),
                seed(marcos, "La gente trabaja mejor cuando puede cerrar una tarea visible", "Terminar algo concreto libera mas energia que avanzar en cinco frentes difusos. La visibilidad del progreso importa.", 8),
                seed(nora, "Las videollamadas cansan porque eliminan los descansos sociales", "En presencia hay pausas naturales, cambios de foco y pequenos silencios. La pantalla los comprime y exige continuidad.", 9),
                seed(sergio, "Cambiar de taza puede alterar el sabor percibido de una bebida", "El grosor, el peso y hasta la temperatura del recipiente influyen mas de lo que solemos admitir.", 1),
                seed(clara, "Los regalos utiles emocionan mas con los anos", "Con el tiempo se aprecia que alguien haya entendido una necesidad real, no solo un gusto superficial.", 2),
                seed(david, "Las escaleras fomentan encuentros mas memorables que los ascensores", "Subir o bajar permite un tiempo breve pero suficiente para cruzar una frase personal. El ascensor suele forzar otra dinamica.", 3),
                seed(ines, "Guardar capturas de pantalla es una forma de archivo sentimental", "No siempre conservamos informacion; muchas veces guardamos prueba de una emocion o de una version de una relacion.", 4),
                seed(paula, "Las personas adaptan su letra segun quien va a leerla", "Escribir a mano para uno mismo no se parece a dejar una nota visible. Cambia el esfuerzo, la forma y el tono.", 5),
                seed(alex, "La ropa comoda mejora decisiones pequeñas pero constantes", "No te vuelve mas inteligente, pero reduce friccion cotidiana y deja mas atencion libre para otras cosas.", 6)
        );

        for (int index = 0; index < extraSeeds.size(); index++) {
            TheorySeed seed = extraSeeds.get(index);
            List<User> likes = pickVoters(roster, seed.author(), 2 + (index % 7));
            List<User> dislikes = pickVoters(roster, seed.author(), index % 3, likes.toArray(User[]::new));
            seedTheory(seed.author(), seed.title(), seed.content(), seed.daysAgo(), likes, dislikes);
        }
    }

    private void seedTheory(User author,
                            String title,
                            String content,
                            int daysAgo,
                            List<User> likes,
                            List<User> dislikes) {
        Theory theory = new Theory();
        theory.setAuthor(author);
        theory.setTitle(title);
        theory.setContent(content.strip());
        theory.setCreatedAt(LocalDateTime.now().minusDays(daysAgo));
        theory.setScore(likes.size() - dislikes.size());
        Theory savedTheory = theoryRepository.save(theory);

        List<TheoryVote> votes = new ArrayList<>();
        for (User user : likes) {
            votes.add(buildVote(savedTheory, user, 1));
        }
        for (User user : dislikes) {
            votes.add(buildVote(savedTheory, user, -1));
        }
        theoryVoteRepository.saveAll(votes);
    }

    private TheoryVote buildVote(Theory theory, User user, int value) {
        TheoryVote vote = new TheoryVote();
        vote.setTheory(theory);
        vote.setUser(user);
        vote.setValue(value);
        return vote;
    }

    private TheorySeed seed(User author, String title, String content, int daysAgo) {
        return new TheorySeed(author, title, content, daysAgo);
    }

    private List<User> pickVoters(List<User> roster, User author, int count, User... excluded) {
        List<User> skip = new ArrayList<>();
        skip.add(author);
        skip.addAll(Arrays.asList(excluded));

        List<User> voters = new ArrayList<>();
        for (User candidate : roster) {
            if (skip.contains(candidate)) {
                continue;
            }
            voters.add(candidate);
            if (voters.size() == count) {
                break;
            }
        }
        return voters;
    }

    private record TheorySeed(User author, String title, String content, int daysAgo) {
    }
}
