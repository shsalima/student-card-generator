CREATE TABLE IF NOT EXISTS students (
  id INT NOT NULL AUTO_INCREMENT,
  cin VARCHAR(50) NOT NULL,
  apogee_code VARCHAR(50) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  field VARCHAR(120) NULL,
  email VARCHAR(150) NULL,
  status ENUM('accepted', 'pending', 'rejected') NOT NULL DEFAULT 'pending',
  photo_status ENUM('validated', 'waiting', 'rejected') NOT NULL DEFAULT 'waiting',
  rejection_reason TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_students_cin (cin),
  UNIQUE KEY uq_students_apogee_code (apogee_code),
  KEY idx_students_status (status),
  KEY idx_students_field (field)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS student_cards (
  id INT NOT NULL AUTO_INCREMENT,
  student_id INT NOT NULL,
  card_label VARCHAR(80) NOT NULL,
  generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_student_cards_student_id (student_id),
  CONSTRAINT fk_student_cards_student FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
