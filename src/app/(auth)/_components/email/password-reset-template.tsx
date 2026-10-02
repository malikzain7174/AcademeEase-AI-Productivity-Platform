import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

interface PasswordResetTemplateProps {
  name: string;
  code: string;
  resetLink: string;
}

export const PasswordResetTemplate = ({
  name,
  code,
  resetLink,
}: PasswordResetTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your AcademEase password</Preview>
      <Tailwind>
        <Body className='bg-white my-auto mx-auto font-sans'>
          <Container className='border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]'>
            <Heading className='text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0'>
              <strong>AcademEase</strong>
            </Heading>
            <Text className='text-black text-[14px] leading-[24px]'>
              Hello {name},
            </Text>
            <Text className='text-black text-[14px] leading-[24px]'>
              We received a request to reset your password for your AcademEase
              account. To complete the process, please use the verification code
              below or click the button to reset your password.
            </Text>
            <Section className='text-center my-[32px] mx-0'>
              <Text className='text-black text-[24px] font-bold leading-[24px] tracking-[5px] my-[12px]'>
                {code}
              </Text>
            </Section>
            <Section className='text-center my-[32px] mx-0'>
              <Button
                className='bg-[#000000] rounded-full text-white text-[12px] font-semibold no-underline text-center px-5 py-3'
                href={resetLink}
              >
                Reset Password
              </Button>
            </Section>
            <Text className='text-black text-[14px] leading-[24px]'>
              If you didn&apos;t request a password reset, you can safely ignore
              this email.
            </Text>
            <Text className='text-black text-[14px] leading-[24px]'>
              This link will expire in 1 hour.
            </Text>
            <Hr className='border border-solid border-[#eaeaea] my-[26px] mx-0 w-full' />
            <Text className='text-[#666666] text-[12px] leading-[24px]'>
              If the button above doesn&apos;t work, copy and paste this URL
              into your browser:{' '}
              <Link href={resetLink} className='text-blue-600 no-underline'>
                {resetLink}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PasswordResetTemplate;
