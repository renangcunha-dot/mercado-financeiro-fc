// Nomes fictícios organizados por nacionalidade, usados para gerar um
// mercado internacional de jogadores. Nenhum nome aqui corresponde a
// jogador profissional real — são combinações genéricas do banco abaixo.

export const NATIONALITIES = [
  {
    country: 'Brasil',
    first: ['Renan', 'Kaique', 'Vinícius', 'Matheus', 'Bruno', 'Diego', 'Yuri', 'Enzo', 'Gabriel', 'Thiago'],
    last: ['Aguiar', 'Ferreira', 'Salas', 'Machado', 'Nolasco', 'Ribas', 'Duran', 'Peixoto', 'Klein', 'Assis'],
  },
  {
    country: 'Argentina',
    first: ['Mateo', 'Nicolás', 'Facundo', 'Ezequiel', 'Franco', 'Ignacio', 'Tomás', 'Agustín'],
    last: ['Villalba', 'Fernández', 'Acosta', 'Gimenez', 'Cabral', 'Ledesma', 'Bruno', 'Coria'],
  },
  {
    country: 'Uruguai',
    first: ['Bruno', 'Sebastián', 'Nahuel', 'Rodrigo', 'Maximiliano', 'Diego'],
    last: ['Correa', 'Batista', 'Olivera', 'Sosa', 'Methol', 'Recoba'],
  },
  {
    country: 'Portugal',
    first: ['João', 'Rui', 'Tiago', 'Rúben', 'André', 'Gonçalo'],
    last: ['Cardoso', 'Pinto', 'Faria', 'Neto', 'Sequeira', 'Brandão'],
  },
  {
    country: 'Espanha',
    first: ['Álvaro', 'Pablo', 'Iker', 'Marc', 'Hugo', 'Adrián'],
    last: ['Serrano', 'Molina', 'Cortés', 'Vidal', 'Reyes', 'Lozano'],
  },
  {
    country: 'França',
    first: ['Antoine', 'Mathis', 'Léo', 'Hugo', 'Nathan', 'Enzo'],
    last: ['Girard', 'Moreau', 'Lefèvre', 'Bonnet', 'Rousseau', 'Dubois'],
  },
  {
    country: 'Inglaterra',
    first: ['James', 'Harry', 'Oliver', 'George', 'Jack', 'Charlie'],
    last: ['Whitfield', 'Sutton', 'Barrow', 'Kingsley', 'Marsh', 'Holloway'],
  },
  {
    country: 'Holanda',
    first: ['Daan', 'Sven', 'Bram', 'Luuk', 'Thijs', 'Milan'],
    last: ['de Vries', 'Bakker', 'Visser', 'Smit', 'Mulder', 'Dekker'],
  },
]

export function randomNationality() {
  return NATIONALITIES[Math.floor(Math.random() * NATIONALITIES.length)]
}
