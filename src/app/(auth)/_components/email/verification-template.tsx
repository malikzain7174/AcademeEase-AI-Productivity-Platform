import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

interface VerificationTemplateProps {
  name: string;
  code: string;
}

const VerificationTemplate = ({ name, code }: VerificationTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your AcademEase account</Preview>
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
              Thank you for signing up for AcademEase. To verify your email
              address, please use the following verification code:
            </Text>
            <Section className='text-center my-[32px] mx-0'>
              <Text className='text-black text-[24px] font-bold leading-[24px] tracking-[5px] my-[12px]'>
                {code}
              </Text>
            </Section>
            <Text className='text-black text-[14px] leading-[24px]'>
              This code will expire in 1 hour.
            </Text>
            <Text className='text-black text-[14px] leading-[24px]'>
              If you didn&apos;t sign up for AcademEase, you can safely ignore
              this email.
            </Text>
            <Hr className='border border-solid border-[#eaeaea] my-[26px] mx-0 w-full' />
            <Text className='text-[#666666] text-[12px] leading-[24px]'>
              AcademEase - Your Academic Companion
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerificationTemplate;
